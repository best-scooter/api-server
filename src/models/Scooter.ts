import * as e from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import ScooterORM from '../orm/Scooter';
import { JWTError } from '../other/errors';
import { isAdmin, isAdminLevel, isCustomer, isScooter, isThisIdentity } from './Validation';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET?.toString() ?? '';
const bcryptSalt = 10;

// **** Helper functions **** //

async function _createJwt(scooterId: number) {
    try {
        const token = jwt.sign(
            {  // payload
                type: "scooter",
                id: scooterId,
                scooterId
            },
            jwtSecret
        );

        return token
    } catch (error) {
        throw new JWTError(error)
    }
}

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    if (!isAdmin(req.headers) && !isCustomer(req.headers) && !isScooter(req.headers)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooters = await ScooterORM.findAll();

    if (scooters) {
        return res.status(HttpStatusCodes.OK).json({ data: scooters });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    if (!isAdminLevel(req.headers, "superadmin")) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooters = await ScooterORM.findAll();

    for (const scooter of scooters) {
        scooter.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);

    if (!isAdmin(req.headers) && !isCustomer(req.headers) && !isThisIdentity(req.headers, scooterId)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooter = await ScooterORM.findOne({
        where: { id: scooterId }
    })

    if (scooter) {
        return res.status(HttpStatusCodes.OK).json({data: scooter});
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    if (!isAdmin(req.headers)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const password = req.body.password ?? "";
    const hash = await bcrypt.hash(password, bcryptSalt)
    const scooterId = parseInt(req.params.scooterId);
    const scooterData = {
        password: hash
    };
    const token = await _createJwt(scooterId);
    let scooter;

    if (scooterId) {
        // if customerId is truthy (not 0) create with given id
        scooter = await ScooterORM.create({
            ...scooterData,
            id: scooterId
        })
    } else {
        // else create with auto assigned id
        scooter = await ScooterORM.create(scooterData)
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: {
            token,
            scooterId: scooter.id
        }
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);

    if (!isAdmin(req.headers) && !isThisIdentity(req.headers, scooterId)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const admin = await ScooterORM.findOne({
        where: { id: scooterId }
    });

    if (!admin) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let scooterData = {};

    // for each property in the body add it to the data
    Object.keys(req.body).forEach((key) => {
        scooterData = {
            ...scooterData,
            [key]: req.body[key]
        }
    });

    await admin.update(scooterData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.adminId);

    if (!isAdmin(req.headers)) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooter = await ScooterORM.findOne({
        where: { id: scooterId }
    });

    if (!scooter) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await scooter.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function tokenPost(req: e.Request, res: e.Response) {
    const scooterId = req.body.scooterId?.toString() ?? "";
    const password = req.body.password?.toString() ?? "";

    if (!scooterId || !password) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "Missing scooter id and/or password."
        })
    }

    const scooter = await ScooterORM.findOne({ where: { id: scooterId }});

    if (!scooter) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    const correctPassword = await bcrypt.compare(password, scooter.password);

    if (!correctPassword) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).end();
    }

    try {
        const token = await _createJwt(scooter.id);

        return res.status(HttpStatusCodes.OK).json({
            data: {
                token,
                scooterId: scooter.id
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
