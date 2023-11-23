import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import ScooterModel from '../models/Scooter'

// **** Variables **** //

const validate = jetValidator();

// ** Add scooterRouter ** //

const scooterRouter = Router();

// Post scooter id and password to get jwt token
scooterRouter.post(Paths.Scooter.Token, ScooterModel.tokenPost);

// Get one scooter
scooterRouter.get(
    Paths.Scooter.One,
    ScooterModel.oneGet
);

// Add one scooter
scooterRouter.post(
    Paths.Scooter.One,
    validate(['password', 'string']),
    ScooterModel.onePost
);

// Update one scooter
scooterRouter.put(Paths.Scooter.One, ScooterModel.onePut);

// Delete one scooter
scooterRouter.delete(Paths.Scooter.One, ScooterModel.oneDelete);

// Get all scooters
scooterRouter.get('/', ScooterModel.baseGet);

// Delete all scooters
scooterRouter.delete('/', ScooterModel.baseDelete);

// **** Export default **** //

export default scooterRouter;
