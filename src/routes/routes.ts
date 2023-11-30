import { Router } from 'express';

import Paths from './Paths';
import customerRouter from './customerRouter';
import adminRouter from './adminRouter';
import scooterRouter from './scooterRouter';
import tripRouter from './tripRouter';
import zoneRouter from './zoneRouter';
import parkingRouter from './parkingRouter';

// **** Set up router and add routes **** //

const apiRouter = Router();

apiRouter.use(Paths.Customer.Base, customerRouter);
apiRouter.use(Paths.Admin.Base, adminRouter);
apiRouter.use(Paths.Scooter.Base, scooterRouter);
apiRouter.use(Paths.Trip.Base, tripRouter);
apiRouter.use(Paths.Zone.Base, zoneRouter);
apiRouter.use(Paths.Parking.Base, parkingRouter);

// **** Export default **** //

export default apiRouter;
