import pointInPolygon from 'point-in-polygon';

import ZoneORM from '../orm/Zone'

// **** Variables **** //

// **** Functions **** //

async function getBestZone(scooterPosition: Array<number>) {
    const zoneIds = await getAllZonesByPosition(scooterPosition);
    const zones = await ZoneORM.findAll({ where: {
        id: zoneIds
    }})
    let bestZoneId = -1;
    let bestZoneValue = -1;

    for (const zone of zones) {
        if (typeof zone.parkingValue === "number" && bestZoneValue < zone.parkingValue) {
            bestZoneValue = zone.parkingValue;
            bestZoneId = zone.id;
        }
    }

    if (bestZoneId === -1) { return null; }

    return bestZoneId;
}

async function getAllZonesByPosition(position: Array<number>) {
    const allZones = await ZoneORM.findAll();
    const zoneIds = [];

    for (const zone of allZones) {
        if (pointInPolygon(position, zone.area)) {
            zoneIds.push(zone.id);
        }
    }

    return zoneIds;
}

function isPositionArray(value: any) {
    if (
        Array.isArray(value) &&
        value.length === 2 &&
        typeof value[0] === "number" &&
        typeof value[1] === "number"
    ) {
        return true;
    }

    return false;
}

function isPositionArrayArray(value: any) {
    // if value is an array
    if(Array.isArray(value)) {
        // and at least one item in the root array
        for (const item of value) {
            // is not an array with two numbers
            if (!isPositionArray(item)) { 
                return false;
            }
        }
    }

    // valid! value is of shape [number, number][] and can be used to draw a polygon
    return true;
}

// **** Exports **** //

export {
    getBestZone,
    getAllZonesByPosition,
    isPositionArray,
    isPositionArrayArray
}