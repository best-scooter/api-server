/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import 'express-async-errors';
import { OAuthApp, App, createNodeMiddleware } from 'octokit';

import BaseRouter from '@src/routes/routes';
import Paths from '@src/routes/Paths';
import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/errors';
import sequelize from '@src/orm/Sequelize';

// **** Variables **** //

const appId = "628947";
const privateKey = `MIIEpAIBAAKCAQEAyRyCqs5M6aAsUO+IcRFPqVm1BmY5HzV9bN8SLTbsnlnX9Na5
MfrhIx14XfqvaIxNtDbOXq712vz2lNLp5+w7K3fq6XKlvSbzsb5dR/Awe7zCdRGt
F3tto41650Ba+oKcHF6SNL+hX9NWsIRGwda8lw1LLk4a/HYUGt3iw8QCAAYdzplw
UBbNpzyCx9Zkg9G79WUo0P6nDZHfeHgIbrlqjXnzQwEk6ImM1sxfFYxHQUb35KC6
JmvvPp3/uifwv2BG0wr3e/E+prY+SipTbmLBTEa6/Ex84uxk6HD/1CITP9ef1MdJ
W5To3nVh4Bf/uCbJA+g2wW9BPCeR0qbSHaf0uQIDAQABAoIBAQCAz3oB3ND2cljw
HfvOL8BOP97qkl7T1nbXXKlPvHYhlnnzn/RORtocm6uUxhPDatn6K4BStM1TzeJB
wDWBDpV3af9UNtJhLKm5lqw4f2cOWgBS61dqSuwWbW/i3h1nhnBm20vZ7UN3FO3Z
cV/Al8GDHkihB/XQ7fBCpQuxR8HgMOZ/r6+HFh8besYup3rxbTqCPDSWY0Fe1o2Y
/5BeEr/NkcrIKH0TCnIxOVYzjvZWrJJqhSCg/burHwM8l7sJJ/naPIpyYvXiP/P/
AcI5Y8M6rCCm4yRD2qABURPyMm50YHQui28eEgWb6hYvSg4l0VZdl+vgfVC9jA4T
Bgswxk2BAoGBAPuWgzQzFr0TO7DEv5AzlBZ0EXQfrrhW58SprbJoI2izMkNeTqFc
29IFE0NhNMm7abYoLPeorkkArSWuonfHVHu7deQfFYJ/mJh90LL2/Xxqq0JkkBno
17wB3p+rw6fhsJKPV78V5CI/9FOPgt+zvZd7FK8oKEJ4CAwcXSjUUTp9AoGBAMyj
YvxmvGeDA0xqu6GqA1GXC9h9DzCdosJayRujhhDgwmQo4q+tyR4iAnFZdrRHir8h
pR2kV/Fr+2Z9Inr2wliqpQBXXGRZI3beaoAl+ksvSNmFBrkY0zWJnuHrJcU+7wmq
ucN+VBoDc7k3jUkZWElmMixDAnygVLrZiaK1AjvtAoGBANAtkjGeWKFpicnSc8TJ
uS7/KfYRxUyJtMw5rx3iJ/KZ3Ox728qQAOD/DBqEE98dcfKludfQPy7vHVcB8zPz
v4eG7Z0uz2ilVkpQSWHdGJFb3oxYlBisX98VGPa8dXC0QpxzeiMG5Tgl/XErXhrn
KulukgYBz5Z4pggHbFq9nN0tAoGAHXkexZmKYyI0dGoe8g7JgZPOqfSBHpBlo7Zt
pqRrp7ynYsOcuo6+G6/sSCUJerefHR4caOOFowjZYY5+S9WEcj7Jmv36GZ3ZBMLN
9f0CSpfZ1zJYoIoZyWkzz/gNLZZ92ReUv7pPJJwAq9l7aN7Un2Wvrj5MemShL3Qr
ZZrKYpUCgYBIwXdWgbXjOaGj99iOrkBr9fqpJuGevIM1OVNBaj1aYaNQ8OVeIs0A
xT3rMychxaV/cNeo5FXzUZiySMApVfORyjF2AocANWSbRinZurPAfN21BM5f9t52
U27DDNPVMe59RqQfIIvRD1ePnoKSHpn3rsWWKUe1a+Dj5r6zlQiM+g==`
const clientId = "Iv1.ff4ed95156ac20bb";
const clientSecret = "a16a100dc7a9d39854219c31a764adb90efe1b86";
const app = express();
const oAuth = new App({
    appId,
    privateKey,
    oauth: {
        clientId,
        clientSecret
    },
    defaultScopes: ["user:email"],
    webhooks: {secret: "ooo"}
});

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Octokit OAuth middleware
app.use(createNodeMiddleware(oAuth))

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
    app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
    app.use(helmet());
}

// Test database connection and sync
sequelize.authenticate();
// sequelize.sync();
sequelize.sync({ alter: true });
// sequelize.sync({ force: true });

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
