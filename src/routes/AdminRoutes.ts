import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import AdminModel from '../models/Admin'

// **** Variables **** //

const validate = jetValidator();

// ** Add adminRouter ** //

const adminRouter = Router();

// Get all admins
adminRouter.get('/', AdminModel.baseGet);

// Delete all admins
adminRouter.delete('/', AdminModel.baseDelete);

// Post username and password to get jwt token
adminRouter.post(Paths.Admin.Token, AdminModel.tokenPost);

// Get one admin
adminRouter.get(
    Paths.Admin.One,
    AdminModel.oneGet
);

// Add one admin
adminRouter.post(
    Paths.Admin.One,
    validate(['username', 'string'], ['password', 'string'], ['level', 'string']),
    AdminModel.onePost
);

// Update one admin
adminRouter.put(Paths.Admin.One, AdminModel.onePut);

// Delete one admin
adminRouter.delete(Paths.Admin.One, AdminModel.oneDelete);

// **** Export default **** //

export default adminRouter;
