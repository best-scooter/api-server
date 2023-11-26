
// **** Variables **** //

// **** Functions **** //

async function getBestZone(scooterPosition: Array<number>) {

    return 1;
}

async function getAllZonesByPosition(position: Array<number>) {

    return [1];
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