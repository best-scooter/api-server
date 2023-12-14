import * as e from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import ScooterORM from '../orm/Scooter';
import { JWTError } from '../other/errors';
import { isAdmin, isAdminLevel, isCustomer, isScooter, isThisIdentity } from './validation';

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
    const valid = await isAdmin(req.headers) || await isCustomer(req.headers) || await isScooter(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooters = await ScooterORM.findAll({
        attributes: { exclude: ['password'] }
    });

    if (scooters) {
        return res.status(HttpStatusCodes.OK).json({ data: scooters });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
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
    const valid = isAdmin(req.headers) || await isCustomer(req.headers) || await isThisIdentity(req.headers, scooterId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooter = await ScooterORM.findByPk(scooterId, {
        attributes: { exclude: ['password'] }
    });

    if (scooter) {
        return res.status(HttpStatusCodes.OK).json({data: scooter});
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
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

    try {
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
    } catch(error) {
        return res.status(HttpStatusCodes.CONFLICT).end();
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
    const valid = await isAdmin(req.headers) || await isThisIdentity(req.headers, scooterId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooter = await ScooterORM.findByPk(scooterId);

    if (!scooter) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let scooterData = {};

    // for each property in the body add it to the data
    // except if it's the ID, which we do not change
    for (const key of Object.keys(req.body)) {
        if (
            key === "id" ||
            key === "scooterId" ||
            key === "message"
        ) { continue; }

        if (key === "password") {
            scooterData = {
                ...scooterData,
                [key]: await bcrypt.hash(req.body[key], bcryptSalt)
            };
        } else {
            scooterData = {
                ...scooterData,
                [key]: req.body[key]
            };
        }
    }

    // if (scooterData.hasOwnProperty('id')) {
    //     res.status(HttpStatusCodes.FORBIDDEN).json({error: "Updating scooter id is not allowed."});
    // }

    await scooter.update(scooterData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooter = await ScooterORM.findByPk(scooterId);

    if (!scooter) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await scooter.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function tokenPost(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.body.scooterId);
    const password = req.body.password?.toString() ?? "";

    if (!scooterId || !password) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
            error: "Missing scooter id and/or password."
        })
    }

    const scooter = await ScooterORM.findByPk(scooterId);

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
