import * as e from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import AdminORM from '../orm/Admin';
import { JWTError } from '../other/errors';
import { isAdmin, isAdminLevel, isThisIdentity } from './Validation';
import EnvVars from '../constants/EnvVars';
import { NodeEnvs } from '../constants/misc';
import Admin from '../orm/Admin';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? '';
const bcryptSalt = 10;

// **** Helper functions **** //

async function _createJwt(username: string, level: string, adminId: number) {
    try {
        const token = jwt.sign(
            {  // payload
                type: "admin",
                adminUsername: username,
                adminLevel: level,
                id: adminId
            },
            jwtSecret,
            { expiresIn: '4h'}
        );

        return token
    } catch (error) {
        throw new JWTError(error)
    }
}

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admins = await AdminORM.findAll();

    if (admins) {
        return res.status(HttpStatusCodes.OK).json({ data: admins });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admins = await AdminORM.findAll();

    for (const admin of admins) {
        admin.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const adminId = parseInt(req.params.adminId);
    const valid = await isAdminLevel(req.headers, "superadmin") || await isThisIdentity(req.headers, adminId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admin = await AdminORM.findOne({
        where: { id: adminId }
    })

    if (admin) {
        return res.status(HttpStatusCodes.OK).json({data: admin});
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const username = req.body.username ?? "";
    const level = req.body.level ?? "";
    const password = req.body.password ?? "";
    const hash = await bcrypt.hash(password, bcryptSalt)
    const adminId = parseInt(req.params.adminId);
    const adminData = {
        username,
        password: hash,
        level
    };
    let admin;

    if (adminId) {
        // if customerId is truthy (not 0) create with given id
        admin = await AdminORM.create({
            ...adminData,
            id: adminId
        })
    } else {
        // else create with auto assigned id
        admin = await AdminORM.create(adminData)
    }
    
    const token = await _createJwt(username, level, admin.id);

    return res.status(HttpStatusCodes.CREATED).json({
        data: {
            token,
            username
        }
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const adminId = parseInt(req.params.adminId);
    const valid = await isAdminLevel(req.headers, "superadmin") || await isThisIdentity(req.headers, adminId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admin = await AdminORM.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let adminData = {};

    // for each property in the body add it to the data
    Object.keys(req.body).forEach((key) => {
        adminData = {
            ...adminData,
            [key]: req.body[key]
        }
    });

    if (adminData.hasOwnProperty('username')) {
        res.status(HttpStatusCodes.FORBIDDEN).json({error: "Updating admin username is not allowed."});
    }

    await admin.update(adminData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const adminId = parseInt(req.params.adminId);
    const valid = await isAdminLevel(req.headers, "superadmin") || await isThisIdentity(req.headers, adminId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admin = await AdminORM.findOne({
        where: { id: adminId }
    });

    if (!admin) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await admin.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function tokenPost(req: e.Request, res: e.Response) {
    const username = req.body.username?.toString() ?? "";
    const password = req.body.password?.toString() ?? "";


    if (!username || !password) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "Missing username and/or password."
        })
    }

    const admin = await AdminORM.findOne({ where: { username }});

    if (!admin) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }

    const correctPassword = await bcrypt.compare(password, admin.password);

    if (!correctPassword) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }
    const level = admin.level ?? "";

    try {
        const token = await _createJwt(username, level, admin.id);

        return res.status(HttpStatusCodes.OK).json({
            data: {
                token,
                username,
                adminId: admin.id
            }
        });
    } catch (error) {
        // token invalid or request error
        console.log(error)
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }
}

async function setupPost(req: e.Request, res: e.Response) {
    if (
        EnvVars.NodeEnv !== NodeEnvs.Test.valueOf() &&
        EnvVars.NodeEnv !== NodeEnvs.Dev.valueOf()
    ) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const username = "chefen";
    const password = "chefen";
    const level = "superadmin";
    const hash = await bcrypt.hash(password, bcryptSalt);
    const admin = await AdminORM.findOrCreate({
        where: { username },
        defaults: {
            username,
            password: hash,
            level
        }
    });
    
    const token = await _createJwt(username, level, admin[0].id);

    return res.status(HttpStatusCodes.CREATED).json({
        data: {
            token,
            username,
            adminId: admin[0].id
        }
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
    tokenPost,
    setupPost
} as const;
