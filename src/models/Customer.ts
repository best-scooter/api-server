import * as e from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { Octokit } from 'octokit';
import jwt from 'jsonwebtoken';

import CustomerORM from '../orm/Customer';
import githubApp from './githubApp';
import EnvVars from '../constants/EnvVars';
import { OAuthError, JWTError } from '../other/errors';
import { isAdmin, isAdminLevel, isThisIdentity } from './validation';
import { NodeEnvs } from '../constants/misc';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? '';

// **** Helper functions **** //

async function _getPrimaryEmail(oAuthToken: string) {
    let primaryEmail = '';
    let result;

    try {
        const octokit = new Octokit({ auth: oAuthToken });
        result = await octokit.request('GET /user/emails');
    } catch (error) {
        throw new OAuthError(error);
    }
        
    for (const email of result.data) {
        if (email.primary) {
            primaryEmail = email.email;
        }
    }

    return primaryEmail;
}

function _createJwt(email: string, customerId: number) {
  try {
    const token = jwt.sign(
        {  // payload
            type: 'customer',
            id: customerId,
            customerEmail: email,
            customerId
        },
        jwtSecret,
        { expiresIn: '4h'},
    );

        return token;
    } catch (error) {
        throw new JWTError(error);
    }
}

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const customers = await CustomerORM.findAll();

    if (customers) {
        return res.status(HttpStatusCodes.OK).json({ data: customers });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, 'superadmin');

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const customers = await CustomerORM.findAll();

    for (const customer of customers) {
        customer.destroy();
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const valid = await isAdmin(req.headers) || await isThisIdentity(req.headers, customerId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const customer = await CustomerORM.findByPk(customerId);

    if (customer) {
        return res.status(HttpStatusCodes.OK).json({ data: customer });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    const oAuthToken = req.body.oAuthToken ?? '';
    const customerId = parseInt(req.params.customerId);
    const email = req.body.email ?? '';
    const customerData = {
        email,
        customerName: req.body.customerName ?? null,
    };
    const token = _createJwt(email, customerId);
    let emailFromOAuth = '';
    let customer;

    // Get email if there's an oauth token
    if (oAuthToken) {
        emailFromOAuth = await _getPrimaryEmail(oAuthToken);
    }

    // If in production mode and
    // the entered email is not equal to the email with the oauth provider
    // fail the request to create an account
    if (
        EnvVars.NodeEnv === NodeEnvs.Production.valueOf() &&
            emailFromOAuth !== email
    ) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    try {
        if (customerId) {
        // if customerId is truthy (not 0) create with given id
        customer = await CustomerORM.create({
            ...customerData,
            id: customerId,
        });
        } else {
        // else create with auto assigned id
        customer = await CustomerORM.create(customerData);
        }
    } catch (error) {
        return res.status(HttpStatusCodes.CONFLICT).end();
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: {
            token,
            email,
            customerId: customer.id,
        },
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const valid = await isAdmin(req.headers) || await isThisIdentity(req.headers, customerId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const customer = await CustomerORM.findByPk(customerId);

    if (!customer) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let customerData = {};

    // for each property in the body add it to the data
    // except if it's the ID email, which we do not change
    Object.keys(req.body).forEach((key) => {
        if (key === "id" || key === "customerId" || key === "email") { return; }
        customerData = {
            ...customerData,
        [key]: req.body[key],
        };
    });

    // if (customerData.hasOwnProperty('email') || customerData.hasOwnProperty('id')) {
    //     res.status(HttpStatusCodes.FORBIDDEN).json({error: 'Updating customer email or id is not allowed.'});
    // }

    await customer.update(customerData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const valid = await isAdmin(req.headers) || await isThisIdentity(req.headers, customerId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const customer = await CustomerORM.findByPk(customerId);

    if (!customer) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await customer.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function authGet(req: e.Request, res: e.Response) {
    const redirectUrl = req.query?.redirectUrl ?? 'http://localhost:3000/authcallback';

    const url = githubApp.oauth.getWebFlowAuthorizationUrl({
        redirectUrl: redirectUrl.toString()
    });


  return res.status(HttpStatusCodes.OK).json({data: url});
}

async function authPost(req: e.Request, res: e.Response) {
    const code = req.body.code?.toString() ?? '';
    const state = req.body.state?.toString() ?? '';
    let oAuthResponse;

    try {
        oAuthResponse = await githubApp.oauth.createToken({
            code,
            state,
        });
    } catch (error) {
        console.error(error);
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }

    const token = oAuthResponse.authentication.token;
    // console.log(token);

    return res.status(HttpStatusCodes.OK).json({data: {
        oAuthToken: token,
    }});
}

async function tokenPost(req: e.Request, res: e.Response) {
    const oAuthToken = req.body.oAuthToken?.toString() ?? '';
    const emailFromRequest = req.body.email?.toString() ?? '';
    let emailFromOAuth = '';

    // Get email if there's a valid oauth token
    if (oAuthToken) {
        try {
            emailFromOAuth = await _getPrimaryEmail(oAuthToken);
        } catch (error) {
            console.error(error);
        }
    }

    // If in production mode and
    // the oAuthToken is not able to get primary email
    // return status unauthorized
    if (
        EnvVars.NodeEnv === NodeEnvs.Production.valueOf() &&
        !emailFromOAuth
    ) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }

    const email = oAuthToken ? emailFromOAuth : emailFromRequest;

    const customer = await CustomerORM.findOne({where: { email }});

    if (!customer) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    const token = _createJwt(email, customer.id);

    return res.status(HttpStatusCodes.OK).json({
        data: {
            token,
            email,
            customerId: customer.id,
        },
    });
}

// **** Export default **** //

export default {
    baseGet,
    baseDelete,
    oneGet,
    onePost,
    onePut,
    oneDelete,
    authGet,
    authPost,
    tokenPost,
} as const;
