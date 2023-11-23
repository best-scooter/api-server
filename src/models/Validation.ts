import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken'

// **** Variables **** //

const jwtSecret = process.env.JWT_SECRET ?? "";

// **** Functions **** //

function getTokenPayload(headers: IncomingHttpHeaders) {
    const token = headers["x-access-token"]?.toString() ?? "";
    const payload = jwt.verify(token, jwtSecret);

    return payload;
}

function isAdmin(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "admin") {
        return true;
    }

    return false;
}

function isAdminLevel(headers: IncomingHttpHeaders, level: string) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error)
        return false;
    }

    if (typeof payload === "object" && payload.type === "admin" && payload.adminLevel === level) {
        return true;
    }

    return false;
}

function isCustomer(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "customer") {
        return true;
    }

    return false;
}

function isScooter(headers: IncomingHttpHeaders) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    if (typeof payload === "object" && payload.type === "scooter") {
        return true;
    }

    return false;
}

function isThisIdentity(headers: IncomingHttpHeaders, id: number) {
    let payload;

    try {
        payload = getTokenPayload(headers);
    } catch (error) {
        // console.error(error);
        return false;
    }

    console.log(typeof payload === "object" && payload.id);
    console.log(id);

    if (typeof payload === "object" && payload.id === id) {
        return true;
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
