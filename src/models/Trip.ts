import * as e from 'express';

import HttpStatusCodes from '../constants/HttpStatusCodes';
import TripORM from '../orm/Trip';
import { isAdmin, isAdminLevel, isCustomer, isScooter, isThisIdentity, isThisCustomer, isThisScooter } from './validation';
import { getBestZone } from './position';
import { start } from 'repl';

// **** Variables **** //

// **** Helper functions **** //

// **** Route functions **** //

async function baseGet(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const trips = await TripORM.findAll();

    if (trips) {
        return res.status(HttpStatusCodes.OK).json({ data: trips });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function baseDelete(req: e.Request, res: e.Response) {
    const valid = await isAdminLevel(req.headers, "superadmin");

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const trips = await TripORM.findAll();

    for (const trip of trips) {
        trip.destroy()
    }

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {
    const tripId = parseInt(req.params.tripId);
    const trip = await TripORM.findByPk(tripId);
    const scooterId = trip?.scooterId ?? -1;
    const customerId = trip?.customerId ?? -1;
    const valid = (
        isAdmin(req.headers) ||
        isThisCustomer(req.headers, customerId) ||
        isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    if (!trip) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    return res.status(HttpStatusCodes.OK).json({data: trip});
}

async function onePost(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers) || await isCustomer(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const tripId = parseInt(req.params.tripId);
    const customerId = parseInt(req.body.customerId);
    const scooterId = parseInt(req.body.scooterId);
    const priceInitial = parseFloat(req.body.priceInitial);
    const priceTime = parseFloat(req.body.priceTime);
    const priceDistance = parseFloat(req.body.priceDistance);
    // starts now
    const timeStarted = new Date();
    // create startposition as array with the first pair of coordinates
    const startPosition = [
        parseFloat(req.body.startPosition[0]),
        parseFloat(req.body.startPosition[1])
    ];
    // best pickup zone is calculated by the highest 'parkingValue'
    // of all the zones the scooters starts in
    const bestPickupZone = await getBestZone(startPosition);
    const tripData = {
        customerId,
        scooterId,
        priceInitial,
        priceTime,
        priceDistance,
        bestPickupZone,
        timeStarted,
        route: [startPosition],
    };
    let trip;

    try {
        if (tripId) {
            // if customerId is truthy (not 0) create with given id
            trip = await TripORM.create({
                ...tripData,
                id: tripId
            })
        } else {
            // else create with auto assigned id
            trip = await TripORM.create(tripData)
        }
    } catch(error) {
        console.error(error);
        return res.status(HttpStatusCodes.CONFLICT).end();
    }

    return res.status(HttpStatusCodes.CREATED).json({
        data: { tripId: trip.id }
    });
}

async function onePut(req: e.Request, res: e.Response) {
    const tripId = parseInt(req.params.tripId);
    const trip = await TripORM.findByPk(tripId);
    const scooterId = trip?.scooterId ?? -1;
    const customerId = trip?.customerId ?? -1;
    const valid = (
        isAdmin(req.headers) ||
        isThisCustomer(req.headers, customerId) ||
        isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    if (!trip) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    let tripData = {};
    let routeAppend: number[][] = [];
    let bestParkingZone = -1;

    // routeAppend logic
    // this causes unexpected behaviour if both route and routeAppend
    // is used, which is acceptable and documented
    if (req.body.hasOwnProperty("routeAppend")) {
        const route = trip.route ?? [];
        const append = req.body["routeAppend"];
        routeAppend = route.concat(append);
    }

    // endPosition logic
    if (req.body.hasOwnProperty("endPosition")) {
        bestParkingZone = await getBestZone(req.body["endPosition"]);
    }

    // for each property in the body add it to the data
    Object.keys(req.body).forEach((key) => {
        if (key === "routeAppend") {
            tripData = {
                ...tripData,
                route: routeAppend
            };
        } else if (key === "endPosition") {
            tripData = {
                ...tripData,
                bestParkingZone
            };
        } else if (key === "timeEnded") {
            tripData = {
                ...tripData,
                timeEnded: new Date(req.body[key])
            };
        } else {
            tripData = {
                ...tripData,
                [key]: req.body[key]
            };
        }
    });

    if (tripData.hasOwnProperty('id')) {
        res.status(HttpStatusCodes.FORBIDDEN).json({error: "Updating trip id is not allowed."});
    }

    await trip.update(tripData);

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneDelete(req: e.Request, res: e.Response) {
    const valid = await isAdmin(req.headers);

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const tripId = parseInt(req.params.tripId);
    const trip = await TripORM.findByPk(tripId);

    if (!trip) {
        return res.status(HttpStatusCodes.NOT_FOUND).end();
    }

    await trip.destroy();

    return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function byCustomer(req: e.Request, res: e.Response) {
    const customerId = parseInt(req.params.customerId);
    const valid = (
        isAdmin(req.headers) ||
        isThisCustomer(req.headers, customerId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const trips = await TripORM.findAll({where: {customerId}});

    if (trips) {
        return res.status(HttpStatusCodes.OK).json({ data: trips });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

async function byScooter(req: e.Request, res: e.Response) {
    const scooterId = parseInt(req.params.scooterId);
    const valid = (
        isAdmin(req.headers) ||
        isThisScooter(req.headers, scooterId)
    );

    if (!valid) {
        return res.status(HttpStatusCodes.FORBIDDEN).end();
    }

    const trips = await TripORM.findAll({where: {scooterId}});

    if (trips) {
        return res.status(HttpStatusCodes.OK).json({ data: trips });
    }

    return res.status(HttpStatusCodes.NOT_FOUND).end();
}

// **** Export default **** //

export default {
    baseGet,
    baseDelete,
    oneGet,
    onePost,
    onePut,
    oneDelete,
    byCustomer,
    byScooter
} as const;
