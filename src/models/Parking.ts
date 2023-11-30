import * as e from 'express';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import ParkingORM from '../orm/Parking';
import { isAdmin, isAdminLevel, isCustomer, isScooter, isThisIdentity, isThisCustomer, isThisScooter } from './validation';
import { getAllZonesByPosition } from './position';

// **** Variables **** //

// **** Helper functions **** //

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers) || await isCustomer(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll();

    if (parkings) {
        return res.status(HttpStatusCodes.OK).json({ data: parkings });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll();

    for (const parking of parkings) {
        parking.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const parkingId = parseInt(req.params.parkingId);
    const parking = await ParkingORM.findByPk(parkingId);
    const scooterId = parking?.scooterId ?? -1;
    const valid = (
        await isAdmin(req.headers) ||
        await isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    if (!parking) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    return res.status(HttpStatusCodes.OK).json({data: parking});
}

async function oneDelete(req: e.Request, res: e.Response) {
    const parkingId = parseInt(req.params.parkingId);
    const parking = await ParkingORM.findByPk(parkingId);
    const scooterId = parking?.id ?? -1;
    const valid = await isAdmin(req.headers) || await isThisScooter(req.headers, scooterId);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    if (!parking) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await parking.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function byScooterGet(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);
    const valid = (
        await isAdmin(req.headers) ||
        await isCustomer(req.headers) ||
        await isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll({where: {scooterId}});

    if (!parkings) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    return res.status(HttpStatusCodes.OK).json({ data: parkings });
}

async function byScooterPost(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers) || await isScooter(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const scooterId = parseInt(req.params.scooterId);
    const scooterPosition: [number, number] = req.body.scooterPosition;
    const zoneIds = await getAllZonesByPosition(scooterPosition);

    for (const zoneId of zoneIds) {
        try {
            await ParkingORM.create({
                scooterId,
                zoneId
            })
        } catch(error) {
            console.error(error);
            return res.status(HttpStatusCodes.CONFLICT).end();
        }
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: { zoneIds }
    });
}

async function byScooterDelete(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);
    const valid = (
        await isAdmin(req.headers) ||
        await isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll({ where: { scooterId }});

    for (const parking of parkings) {
        parking.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function byZoneGet(req: e.Request, res: e.Response) {
    const zoneId = parseInt(req.params.zoneId);
    const valid = (
        await isAdmin(req.headers) ||
        await isCustomer(req.headers)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll({where: { zoneId }});

    if (!parkings) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    return res.status(HttpStatusCodes.OK).json({ data: parkings });
}

async function byZoneDelete(req: e.Request, res: e.Response) {
    const zoneId = parseInt(req.params.zoneId);
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const parkings = await ParkingORM.findAll({ where: { zoneId }});

    for (const parking of parkings) {
        parking.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

// **** Export default **** //

export default {
    baseGet,
    baseDelete,
    oneGet,
    oneDelete,
    byScooterGet,
    byScooterPost,
    byScooterDelete,
    byZoneGet,
    byZoneDelete
} as const;
