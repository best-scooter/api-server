/**
 * Setup express server.
 */

import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import 'express-async-errors';
import cors from 'cors';

import BaseRouter from './routes/routes';
import Paths from './routes/Paths';
import EnvVars from './constants/EnvVars';
import HttpStatusCodes from './constants/HttpStatusCodes';
import { NodeEnvs } from './constants/misc';
import { RouteError } from './other/errors';
import sequelize from './orm/Sequelize';
import ScooterORM from './orm/Scooter';
import TripORM from './orm/Trip';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
    preflightContinue: true
}));

// // Show routes called in console during development
// if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
//     app.use(morgan('dev'));
// }
// Alwasy show routes called in console
app.use(morgan('dev'));

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
    app.use(helmet());
}

// Test database connection and sync
try {
    // sequelize.sync({ force: true });
    sequelize.sync();
    // sequelize.sync({ alter: true });
    sequelize.authenticate();
} catch (error) {
    console.error(error);
    console.error("Database connection failed.");
}

// Make sure all scooters are disconnected
// and assume 50% battery until the first update
ScooterORM.findAll().then((scooters) => {
    for (const scooter of scooters) {
        scooter.update({
            connected: false,
            battery: 0.5
        });
    }
})

// Make sure all trips are closed
TripORM.findAll().then((trips) => {
    for (const trip of trips) {
        // End all ongoing trips
        if (trip.timeEnded === null) {
            trip.update({
                timeEnded: new Date()
            });
        }
    }
})

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
        logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
        status = err.status;
    }
    return res.status(status).json({ error: err.message });
});

// **** Export default **** //

export default app;
