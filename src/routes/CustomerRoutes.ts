import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import CustomerModel from '@src/models/Customer'

// **** Variables **** //

const validate = jetValidator();

// ** Add CustomerRouter ** //

const customerRouter = Router();

// Get all customers
customerRouter.get('/', CustomerModel.baseGet);

// Delete all customers
customerRouter.delete('/', CustomerModel.baseDelete);

// Get code
customerRouter.get(Paths.Customer.AuthUrl, CustomerModel.authUrlGet);

// Get oauth token
customerRouter.get(Paths.Customer.Auth, CustomerModel.authGet);

// Get jwt token
customerRouter.get(Paths.Customer.Token, CustomerModel.tokenGet);

// Delete jwt token
customerRouter.delete(Paths.Customer.Token, CustomerModel.tokenDelete);

// Get jwt token verification
customerRouter.get(Paths.Customer.Verification, CustomerModel.verificationGet);

// Get one customer
customerRouter.get(
    Paths.Customer.One,
    CustomerModel.oneGet
);

// Add one customer
customerRouter.post(
    Paths.Customer.One,
    validate(['email', 'string'], ['password', 'string']),
    CustomerModel.onePost
);

// Update one customer
customerRouter.put(Paths.Customer.One, CustomerModel.onePut);

// Delete one customer
customerRouter.delete(Paths.Customer.One, CustomerModel.oneDelete);

// Add one user
// userRouter.post(
//   Paths.Users.Add,
//   validate(['user', User.isUser]),
//   UserRoutes.add,
// );

// Update one user
// userRouter.put(
//   Paths.Users.Update,
//   validate(['user', User.isUser]),
//   UserRoutes.update,
// );

// Delete one user
// userRouter.delete(
//   Paths.Users.Delete,
//   validate(['id', 'number', 'params']),
//   UserRoutes.delete,
// );

// **** Export default **** //

export default customerRouter;
