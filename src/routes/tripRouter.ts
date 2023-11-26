import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import TripModel from '../models/Trip'

// **** Variables **** //

const validate = jetValidator();

// ** Add tripRouter ** //

const tripRouter = Router();

// Get one trip
tripRouter.get(
    Paths.Trip.One,
    TripModel.oneGet
);

// Add one trip
tripRouter.post(
    Paths.Trip.One,
    validate(
        ["customerId", "number"],
        ["scooterId", "number"],
        ["bestPickupZone", "number"],
        ["startPosition", "array"],
        ["priceInitial", "number"],
        ["priceTime", "number"],
        ["priceDistance", "number"]
    ),
    TripModel.onePost
);

// Update one trip
tripRouter.put(Paths.Trip.One, TripModel.onePut);

// Delete one trip
tripRouter.delete(Paths.Trip.One, TripModel.oneDelete);

// Get all trips
tripRouter.get('/', TripModel.baseGet);

// Delete all trips
tripRouter.delete('/', TripModel.baseDelete);

// **** Export default **** //

export default tripRouter;
