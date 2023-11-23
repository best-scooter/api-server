import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken'

import CustomerORM from '../orm/Customer';
import AdminORM from '../orm/Admin';
import ScooterORM from '../orm/Scooter';

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET ?? "";

// **** Functions **** //

function getTokenPayload(headers: IncomingHttpHeaders) {
    const token = headers["x-access-token"]?.toString() ?? "";
    const payload = jwt.verify(token, jwtSecret);

    return payload;
}

async function isAdmin(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "admin") {
        const result = await AdminORM.findOne({ where: { id: payload.id }})
        if (result) {
            return true;
        }
        return false;
    }

    return false;
}

async function isAdminLevel(headers: IncomingHttpHeaders, level: string) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error)
        return false;
    }

    if (typeof payload === "object" && payload.type === "admin" && payload.adminLevel === level) {
        const result = await AdminORM.findOne({ where: { id: payload.id }})
        if (result) {
            return true;
        }
        return false;
    }

    return false;
}

async function isCustomer(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "customer") {
        const result = await CustomerORM.findOne({ where: { id: payload.id }})
        if (result) {
            return true;
        }
        return false;
    }

    return false;
}

async function isScooter(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "scooter") {
        const result = await ScooterORM.findOne({ where: { id: payload.id }})
        if (result) {
            return true;
        }
        return false;
    }

    return false;
}

async function isThisIdentity(headers: IncomingHttpHeaders, id: number) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.id === id) {
        if (payload.type === "admin") {
            const result = await AdminORM.findOne({ where: { id: payload.id }})
            if (result) {
                return true;
            }
        } else if (payload.type === "customer") {
            const result = await CustomerORM.findOne({ where: { id: payload.id }})
            if (result) {
                return true;
            }
        } else if (payload.type === "scooter") {
            const result = await ScooterORM.findOne({ where: { id: payload.id }})
            if (result) {
                return true;
            }
        }
    }

    return false;
}

export {
    isAdmin,
    isAdminLevel,
    isCustomer,
    isScooter,
    isThisIdentity
};
