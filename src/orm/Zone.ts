import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'

class Zone extends Model<
    InferAttributes<Zone>,
    InferCreationAttributes<Zone>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare type: string;
    declare area: string;
    declare maxSpeed: number | null;
    declare colour: string;
    declare name: string;
    declare description: string | null;
    declare parkingValue: number | null;
}

Zone.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.JSON,
        defaultValue: "[]",
        allowNull: false
    },
    maxSpeed: DataTypes.INTEGER,
    colour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    parkingValue: DataTypes.DECIMAL(10,2)
}, {
    // Other model options go here
    sequelize,
    modelName: 'Zone',
});

export default Zone
