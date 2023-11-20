import * as e from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { Octokit } from 'octokit';
import jwt from 'jsonwebtoken';

import CustomerORM from '../orm/Customer';
import oAuth from './OAuth';
import EnvVars from '../constants/EnvVars';
import { OAuthError, JWTError } from '../other/errors';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? ''

// **** Helper functions **** //

async function createJwt(oAuthToken: string) {
    let primaryEmail = "";
    let result;

    try {
        const octokit = new Octokit({ auth: oAuthToken });
        result = await octokit.request("GET /user/emails");
    } catch (error) {
        throw new OAuthError(error)
    }
    
    for (const email of result.data) {
        if (email.primary) {
            primaryEmail = email.email;
        }
    }

    try {
        const token = jwt.sign(
            {  // payload
                type: "customer",
                customerEmail: primaryEmail
            },
            jwtSecret,
            { expiresIn: '1h'}
        );

        return token
    } catch (error) {
        throw new JWTError(error)
    }
}

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const customers = await CustomerORM.findAll();

    if (customers) {
        return res.status(HttpStatusCodes.OK).json({ data: customers });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const customers = await CustomerORM.findAll();

    for (const customer of customers) {
        customer.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const customer = await CustomerORM.findOne({
        where: { id: customerId }
    })

    if (customer) {
        return res.status(HttpStatusCodes.OK).json(customer);
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    const oAuthToken = req.body.oAuthToken ?? "";
    const customerId = parseInt(req.params.customerId);
    const customerData = {
        id: customerId,
        email: req.body.email,
        customerName: req.body.customerName ?? null,
    };
    let token, payload;

    // Let execution continue if there's no oAuthToken
    try {
        token = await createJwt(oAuthToken);
        payload = jwt.verify(token, jwtSecret);
    } catch (error) {
        console.error(error)
        token = "";
        payload = {};
    }

    // If in production mode and
    // the entered email is not equal to the email with the oauth provider is not equal
    // fail the request to create an account
    if (
        EnvVars.NodeEnv === "production" &&
        !(typeof payload === "object" && payload.customerEmail === customerData.email)
    ) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    if (customerId) {
        // if customerId is truthy (not 0) create with given id
        await CustomerORM.create({
            ...customerData,
            id: customerId
        })
    } else {
        // else create with auto assigned id
        await CustomerORM.create(customerData)
    }

    return res.status(HttpStatusCodes.CREATED).end();
}

async function onePut(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const customer = await CustomerORM.findOne({
        where: { id: customerId }
    });

    if (!customer) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let customerData = {};

    // for each property in the body add it to the data
    Object.keys(req.body).forEach((key) => {
        customerData = {
            ...customerData,
            [key]: req.body[key]
        }
    });

    await customer.update(customerData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const customer = await CustomerORM.findOne({
        where: { id: customerId }
    });

    if (!customer) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await customer.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function authGet(req: e.Request, res: e.Response) {
    const redirectUrl = req.params?.redirectUrl ?? "http://localhost:3000/authcallback";
    const url = oAuth.getWebFlowAuthorizationUrl({
        redirectUrl
    })

    return res.status(HttpStatusCodes.OK).json({data: url});
}

async function authPost(req: e.Request, res: e.Response) {
    const code = req.body.code?.toString() ?? "";

    const token = await oAuth.createToken({
        code
    });

    return res.status(HttpStatusCodes.OK).json(token);
}

async function tokenPost(req: e.Request, res: e.Response) {
    const oAuthToken = req.body.oAuthToken?.toString() ?? "";

    try {
        const token = await createJwt(oAuthToken);
        const payload = jwt.verify(token, jwtSecret)
        let email;

        if (typeof payload === 'object') {
            email = payload.customerEmail ?? "";
        }

        return res.status(HttpStatusCodes.OK).json({
            data: {
                token,
                email
            }
        });
    } catch (error) {
        // token invalid or request error
        console.log(error)
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }
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
    tokenPost
} as const;
