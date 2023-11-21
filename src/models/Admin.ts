import * as e from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import AdminORM from '../orm/Admin';
import { JWTError } from '../other/errors';
import { isAdmin, isAdminLevel, isThisIdentity } from './Validation';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? '';
const bcryptSalt = 10;

// **** Helper functions **** //

async function _createJwt(username: string, level: string) {
    try {
        const token = jwt.sign(
            {  // payload
                type: "admin",
                adminUsername: username,
                adminLevel: level
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
    if (!isAdmin(req.headers)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admins = await AdminORM.findAll();

    if (admins) {
        return res.status(HttpStatusCodes.OK).json({ data: admins });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    if (!isAdminLevel(req.headers, "superadmin")) {
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

    if (!isAdminLevel(req.headers, "superadmin") && !isThisIdentity(req.headers, adminId)) {
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
    if (!isAdminLevel(req.headers, "superadmin")) {
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
    const token = await _createJwt(username, level);

    if (adminId) {
        // if customerId is truthy (not 0) create with given id
        await AdminORM.create({
            ...adminData,
            id: adminId
        })
    } else {
        // else create with auto assigned id
        await AdminORM.create(adminData)
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: {
            token,
            username
        }
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const adminId = parseInt(req.params.adminId);

    if (!isAdminLevel(req.headers, "superadmin") && !isThisIdentity(req.headers, adminId)) {
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

    await admin.update(adminData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const adminId = parseInt(req.params.adminId);

    if (!isAdminLevel(req.headers, "superadmin") && !isThisIdentity(req.headers, adminId)) {
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
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    const correctPassword = await bcrypt.compare(password, admin.password);

    if (!correctPassword) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }

    const level = admin.level ?? "";

    try {
        const token = await _createJwt(username, level);

        return res.status(HttpStatusCodes.OK).json({
            data: {
                token,
                username
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
    tokenPost
} as const;
