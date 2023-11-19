import { Sequelize } from 'sequelize'

import EnvVars from '../constants/EnvVars';
import { NodeEnvs } from '../constants/misc';

// **** Variables **** //

// Database
let databaseServer = '';

switch (EnvVars.NodeEnv) {
    case NodeEnvs.Production.valueOf():
        databaseServer = 'localhost';
        break;
    case NodeEnvs.Dev.valueOf():
        databaseServer = 'localhost'
        break;
    case NodeEnvs.Sim.valueOf():
        databaseServer = 'database-server';
        break;
}

// **** Instansiate sequelize **** //

const sequelize = new Sequelize('database', 'user', 'password', {
    host: databaseServer,
    dialect: 'mariadb'
})

// **** Export default **** //

export default sequelize
