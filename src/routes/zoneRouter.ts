import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import ZoneModel from '../models/Zone'

// **** Variables **** //

const validate = jetValidator();

// ** Add zoneRouter ** //

const zoneRouter = Router();

// Get one zone
zoneRouter.get(
    Paths.Zone.One,
    ZoneModel.oneGet
);

// Add one zone
zoneRouter.post(
    Paths.Zone.One,
    validate(
        ["type", "string"],
        ["area", "string"],
        ["name", "string"],
        ["colour", "string"]
    ),
    ZoneModel.onePost
);

// Update one zone
zoneRouter.put(Paths.Zone.One, ZoneModel.onePut);

// Delete one zone
zoneRouter.delete(Paths.Zone.One, ZoneModel.oneDelete);

// Get all zones
zoneRouter.get('/', ZoneModel.baseGet);

// Delete all zones
zoneRouter.delete('/', ZoneModel.baseDelete);

// **** Export default **** //

export default zoneRouter;
