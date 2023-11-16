import * as e from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import CustomerORM from '@src/orm/Customer';

// **** Variables **** //

// const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
//   'object with the appropriate user keys.';

// export enum UserRoles {
//   Standard,
//   Admin,
// }

// **** Types **** //

// export interface IUser {
//   id: number;
//   name: string;
//   email: string;
//   pwdHash?: string;
//   role?: UserRoles;
// }

// export interface ISessionUser {
//   id: number;
//   email: string;
//   name: string;
//   role: IUser['role'];
// }

// **** Functions **** //

// async function getAll(_: IReq, res: IRes) {
//   const users = await UserService.getAll();
//   return res.status(HttpStatusCodes.OK).json({ users });
// }

// async function add(req: IReq<{user: IUser}>, res: IRes) {
//   const { user } = req.body;
//   await UserService.addOne(user);
//   return res.status(HttpStatusCodes.CREATED).end();
// }

async function baseGet(req: e.Request, res: e.Response) {
  const customers = await CustomerORM.findAll();
  return res.status(HttpStatusCodes.OK).json({ data: customers });
}

async function baseDelete(req: e.Request, res: e.Response) {
  const customers = await CustomerORM.findAll();

  for (const customer of customers) {
    customer.destroy()
  }

  return res.status(HttpStatusCodes.NO_CONTENT).end();
}

async function oneGet(req: e.Request, res: e.Response) {

}

async function onePost(req: e.Request, res: e.Response) {
  const customerData = req.body;

  await CustomerORM.create(customerData)

  res.status(HttpStatusCodes.CREATED).end();
}

async function onePut(req: e.Request, res: e.Response) {

}

async function oneDelete(req: e.Request, res: e.Response) {

}

async function tokenGet(req: e.Request, res: e.Response) {

}

async function tokenDelete(req: e.Request, res: e.Response) {

}

async function verificationGet(req: e.Request, res: e.Response) {

}



// **** Export default **** //

export default {
  baseGet,
  baseDelete,
  oneGet,
  onePost,
  onePut,
  oneDelete,
  tokenGet,
  tokenDelete,
  verificationGet
} as const;
