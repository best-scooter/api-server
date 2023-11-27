import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'
import CustomerORM from './Customer';
import ScooterORM from './Scooter';
import ZoneORM from './Zone';

class Trip extends Model<
    InferAttributes<Trip>,
    InferCreationAttributes<Trip>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare customerId: number;
    declare scooterId: number;
    declare bestParkingZone: number | null;
    declare bestPickupZone: number | null;
    declare parkedCharging: boolean | null;
    declare timeStarted: Date | null;
    declare timeEnded: Date | null;
    declare distance: number | null;
    declare route: Array<Array<number>> | null;
    declare priceInitial: number | null;
    declare priceTime: number | null;
    declare priceDistance: number | null;
}

Trip.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    customerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: CustomerORM,
            key: 'id'
        }
    },
    scooterId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: ScooterORM,
            key: 'id'
        }
    },
    bestParkingZone: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: ZoneORM,
            key: 'id'
        }
    },
    bestPickupZone: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: ZoneORM,
            key: 'id'
        }
    },
    parkedCharging: DataTypes.BOOLEAN,
    timeStarted: DataTypes.DATE,
    timeEnded: DataTypes.DATE,
    distance: DataTypes.INTEGER.UNSIGNED,
    route: {
        type: DataTypes.JSON,
        defaultValue: "[]"
    },
    priceInitial: DataTypes.DECIMAL(10,2),
    priceTime: DataTypes.DECIMAL(10,2),
    priceDistance: DataTypes.DECIMAL(10,2)
}, {
    // Other model options go here
    sequelize,
    modelName: 'Trip',
});

export default Trip