import { Router } from 'express';

import Paths from './Paths';
import CustomerRouter from './CustomerRoutes';
import AdminRouter from './AdminRoutes';
import ScooterRouter from './ScooterRoutes';

// **** Set up router and add routes **** //

const apiRouter = Router();

apiRouter.use(Paths.Customer.Base, CustomerRouter);
apiRouter.use(Paths.Admin.Base, AdminRouter)
apiRouter.use(Paths.Scooter.Base, ScooterRouter)

// **** Export default **** //

export default apiRouter;
