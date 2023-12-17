import { Sequelize } from 'sequelize'

import EnvVars from '../constants/EnvVars';
import { NodeEnvs } from '../constants/misc';

// **** Variables **** //

// Database
let options = {};

if (EnvVars.NodeEnv === NodeEnvs.Test.valueOf()) {
    // console.log("server:", EnvVars.DbServer)
    // console.log("username:", EnvVars.DbUsername)
    // console.log("password:", EnvVars.DbPassword)
    options = { logging: false };
}

// **** Instansiate sequelize **** //

const sequelize = new Sequelize(
    EnvVars.DbDatabase,
    EnvVars.DbUsername,
    EnvVars.DbPassword,
    {
        dialect: 'mariadb',
        host: EnvVars.DbServer,
        ...options
    }
)

// **** Export default **** //

export default sequelize
