import { Sequelize } from 'sequelize'

import EnvVars from '../constants/EnvVars';
import { NodeEnvs } from '../constants/misc';

// **** Variables **** //

// Database
let options = {};

switch (EnvVars.NodeEnv) {
    case NodeEnvs.Production.valueOf():
        options = {
            host: 'localhost'
        };
        break;
    case NodeEnvs.Dev.valueOf():
        options = {
            host: 'localhost'
        };
        break;
    case NodeEnvs.Sim.valueOf():
        options = {
            host: 'database-server'
        };
        break;
    case NodeEnvs.Test.valueOf():
        options = {
            host: 'localhost',
            logging: false
        };
        break;
}

// **** Instansiate sequelize **** //

const sequelize = new Sequelize('database', 'user', 'password', {
    dialect: 'mariadb',
    ...options
})

// **** Export default **** //

export default sequelize
