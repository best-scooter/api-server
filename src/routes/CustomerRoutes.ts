import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from './Paths';
import CustomerModel from '../models/Customer'

// **** Variables **** //

const validate = jetValidator();

// ** Add CustomerRouter ** //

const customerRouter = Router();

// Get all customers
customerRouter.get('/', CustomerModel.baseGet);

// Delete all customers
customerRouter.delete('/', CustomerModel.baseDelete);

// Get auth url to get code
customerRouter.get(Paths.Customer.Auth, CustomerModel.authGet);

// Post code to get oauth token
customerRouter.post(Paths.Customer.Auth, CustomerModel.authPost);

// Post oauth token to get jwt token
customerRouter.post(Paths.Customer.Token, CustomerModel.tokenPost);

// Get one customer
customerRouter.get(
    Paths.Customer.One,
    CustomerModel.oneGet
);

// Add one customer
customerRouter.post(
    Paths.Customer.One,
    validate(['email', 'string']),
    CustomerModel.onePost
);

// Update one customer
customerRouter.put(Paths.Customer.One, CustomerModel.onePut);

// Delete one customer
customerRouter.delete(Paths.Customer.One, CustomerModel.oneDelete);

// **** Export default **** //

export default customerRouter;
