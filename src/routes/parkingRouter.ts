import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import ParkingModel from '../models/Parking'
import { isPositionArray } from '../models/position';

// **** Variables **** //

const validate = jetValidator();

// ** Add parkingRouter ** //

const parkingRouter = Router();

// Get all parkings by scooterId
parkingRouter.get(Paths.Parking.Scooter, ParkingModel.byScooterGet);

// Post parkings in all current zones by scooterId
parkingRouter.post(
    Paths.Parking.Scooter,
    validate(["scooterPosition", isPositionArray]),
    ParkingModel.byScooterPost
);

// Delete all parkings by scooterId
parkingRouter.delete(Paths.Parking.Scooter, ParkingModel.byScooterDelete);

// Get all parkings by zoneId
parkingRouter.get(Paths.Parking.Zone, ParkingModel.byZoneGet);

// Delete all parkings by zoneId
parkingRouter.delete(Paths.Parking.Zone, ParkingModel.byZoneDelete);

// Get one parking
parkingRouter.get(Paths.Parking.One, ParkingModel.oneGet);

// Delete one parking
parkingRouter.delete(Paths.Parking.One, ParkingModel.oneDelete);

// Get all parkings
parkingRouter.get('/', ParkingModel.baseGet);

// Delete all parkings
parkingRouter.delete('/', ParkingModel.baseDelete);

// **** Export default **** //

export default parkingRouter;
