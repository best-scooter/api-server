import { Router } from 'express';

import Paths from './Paths';
import customerRouter from './customerRouter';
import adminRouter from './adminRouter';
import scooterRouter from './scooterRouter';

// **** Set up router and add routes **** //

const apiRouter = Router();

apiRouter.use(Paths.Customer.Base, customerRouter);
apiRouter.use(Paths.Admin.Base, adminRouter)
apiRouter.use(Paths.Scooter.Base, scooterRouter)

// **** Export default **** //

export default apiRouter;
