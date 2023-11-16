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

// Get one customer
customerRouter.get(Paths.Customer.One, CustomerModel.oneGet);

// Add one customer
customerRouter.post(
  Paths.Customer.One,
  validate('email', 'password'),
  CustomerModel.onePost
);

// Update one customer
customerRouter.put(Paths.Customer.One, CustomerModel.onePut);

// Delete one customer
customerRouter.delete(Paths.Customer.One, CustomerModel.oneDelete);

// Get token
customerRouter.get(Paths.Customer.Token, CustomerModel.tokenGet);

// Delete token
customerRouter.get(Paths.Customer.Token, CustomerModel.tokenDelete);

// Get verification
customerRouter.get(Paths.Customer.Verification, CustomerModel.verificationGet);

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
