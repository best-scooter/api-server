import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import TripModel from '../models/Trip'
import { isPositionArray } from '../models/position';

// **** Variables **** //

const validate = jetValidator();

// **** Helper functions **** //

// ** Add tripRouter ** //

const tripRouter = Router();

// Get all trips by customerId
tripRouter.get(
    Paths.Trip.Customer,
    TripModel.byCustomer
);

// Get all trips by scooterId
tripRouter.get(
    Paths.Trip.Scooter,
    TripModel.byScooter
);

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
        ["startPosition", isPositionArray]
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
