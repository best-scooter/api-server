import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'
import ScooterORM from './Scooter';
import ZoneORM from './Zone';

class Parking extends Model<
    InferAttributes<Parking>,
    InferCreationAttributes<Parking>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare zoneId: number;
    declare scooterId: number;
}

Parking.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    zoneId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: ZoneORM,
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
    }
}, {
    // Other model options go here
    sequelize,
    modelName: 'Parking',
});

export default Parking