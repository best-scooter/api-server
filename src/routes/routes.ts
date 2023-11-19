import { Router } from 'express';

import Paths from './Paths';
import CustomerRouter from './CustomerRoutes';

// **** Set up router and add routes **** //

const apiRouter = Router();

apiRouter.use(Paths.Customer.Base, CustomerRouter);

// **** Export default **** //

export default apiRouter;
