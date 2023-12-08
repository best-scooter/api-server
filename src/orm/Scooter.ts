import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'

class Scooter extends Model<
    InferAttributes<Scooter>,
    InferCreationAttributes<Scooter>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare password: string;
    declare positionX: number | null;
    declare positionY: number | null;
    declare battery: number | null;
    declare maxSpeed: number | null;
    declare charging: boolean | null;
    declare available: boolean | null;
    declare decomissioned: boolean | null;
    declare beingServiced: boolean | null;
    declare disabled: boolean | null;
    declare connected: boolean | null;
    declare scooterId: CreationOptional<number>;
}

Scooter.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positionX: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
    positionY:{
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
    battery:{
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false
    },
    maxSpeed:{
        type: DataTypes.INTEGER,
        defaultValue: 20,
        allowNull: false
    },
    charging: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    decomissioned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    beingServiced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    disabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    connected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    scooterId: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        },
        set(value) {
            throw new Error("Cannot set scooterId property, use 'id' instead.")
        }
    }
}, {
    // Other model options go here
    sequelize,
    modelName: 'Scooter',
});

export default Scooter
