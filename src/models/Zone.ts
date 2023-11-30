import * as e from 'express';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import ZoneORM from '../orm/Zone';
import { isAdmin, isAdminLevel, isCustomer, isScooter } from './validation';

// **** Variables **** //

// **** Helper functions **** //

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers) || await isCustomer(req.headers) || await isScooter(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zones = await ZoneORM.findAll({
        attributes: { exclude: ['password'] }
    });

    if (zones) {
        return res.status(HttpStatusCodes.OK).json({ data: zones });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zones = await ZoneORM.findAll();

    for (const zone of zones) {
        zone.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const valid = isAdmin(req.headers) || await isCustomer(req.headers) || await isScooter(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zoneId = parseInt(req.params.zoneId);
    const zone = await ZoneORM.findByPk(zoneId);

    if (zone) {
        return res.status(HttpStatusCodes.OK).json({data: zone});
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function onePost(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zoneId = parseInt(req.params.zoneId);
    const zoneData = {
        type: req.body.type,
        area: req.body.area,
        colour: req.body.colour,
        name: req.body.name,
        maxSpeed: req.body.maxSpeed ?? null,
        description: req.body.description ?? null,
        parkingValue: req.body.parkingValue ?? null
    };
    let zone;

    try {
        if (zoneId) {
            // if customerId is truthy (not 0) create with given id
            zone = await ZoneORM.create({
                ...zoneData,
                id: zoneId
            })
        } else {
            // else create with auto assigned id
            zone = await ZoneORM.create(zoneData)
        }
    } catch(error) {
        return res.status(HttpStatusCodes.CONFLICT).end();
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: { zoneId: zone.id }
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zoneId = parseInt(req.params.zoneId);
    const zone = await ZoneORM.findByPk(zoneId);

    if (!zone) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let zoneData = {};

    // for each property in the body add it to the data
    Object.keys(req.body).forEach((key) => {
        zoneData = {
            ...zoneData,
            [key]: req.body[key]
        }
    });

    if (zoneData.hasOwnProperty('id')) {
        res.status(HttpStatusCodes.FORBIDDEN).json({error: "Updating zone id is not allowed."});
    }

    await zone.update(zoneData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const zoneId = parseInt(req.params.zoneId);
    const zone = await ZoneORM.findByPk(zoneId);

    if (!zone) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await zone.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

// **** Export default **** //

export default {
    baseGet,
    baseDelete,
    oneGet,
    onePost,
    onePut,
    oneDelete
} as const;
