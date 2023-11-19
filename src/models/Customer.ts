import * as e from 'express';
import HttpStatusCodes from '../constants/HttpStatusCodes';
import { Octokit } from 'octokit';
import jwt from 'jsonwebtoken';

import CustomerORM from '../orm/Customer';
import oAuth from './OAuth';
import { NodeEnvs } from '../constants/misc';
import EnvVars from '../constants/EnvVars';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? ''

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
    const customerId = parseInt(req.params.customerId);
    const customerData = {
        id: customerId,
        email: req.body.email,
        password: req.body.password,
        customerName: req.body.customerName ?? null,
    };

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

    res.status(HttpStatusCodes.CREATED).end();
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

    res.status(HttpStatusCodes.OK).json(token);
}

async function tokenPost(req: e.Request, res: e.Response) {
    const oAuthToken = req.body.oAuthToken?.toString() ?? "";

    try {
        const octokit = new Octokit({ auth: oAuthToken });
        const result = await octokit.request("GET /user/emails");
        let primaryEmail = "";

        for (const email of result.data) {
          if (email.primary) {
            primaryEmail = email.email;
          }
        }
        const token = jwt.sign({ email: primaryEmail }, jwtSecret)

        const payload = jwt.verify(token, jwtSecret)
        let email;
        if (typeof payload === 'object') {
            email = payload.email ?? "";
        }

        res.status(HttpStatusCodes.OK).json({data: {
            token,
            email
        }});
    } catch (error) {
        console.log("ERROR:")
        console.log(error)
        // token invalid or request error
        res.status(HttpStatusCodes.NOT_FOUND).end();
    }
}

async function tokenDelete(req: e.Request, res: e.Response) {

}

async function verificationGet(req: e.Request, res: e.Response) {

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
    tokenDelete,
    verificationGet
} as const;
