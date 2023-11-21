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
    const payload = getTokenPayload(headers);

    if (typeof payload === "object" && payload.type === "admin") {
        return true;
    }

    return false;
}

function isAdminLevel(headers: IncomingHttpHeaders, level: string) {
    const payload = getTokenPayload(headers);

    if (typeof payload === "object" && payload.type === "admin" && payload.adminLevel === level) {
        return true;
    }

    return false;
}

function isCustomer(headers: IncomingHttpHeaders) {
    const payload = getTokenPayload(headers);

    if (typeof payload === "object" && payload.type === "customer") {
        return true;
    }

    return false;
}

function isScooter(headers: IncomingHttpHeaders) {
    const payload = getTokenPayload(headers);

    if (typeof payload === "object" && payload.type === "scooter") {
        return true;
    }

    return false;
}

function isThisIdentity(headers: IncomingHttpHeaders, id: number) {
    const payload = getTokenPayload(headers);

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
