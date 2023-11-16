import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from '@src/orm/Sequelize'

class Customer extends Model<
    InferAttributes<Customer>,
    InferCreationAttributes<Customer>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare customerName: string;
    declare email: string;
    declare password: string;
    declare positionX: number;
    declare positionY: number;
    declare balance: number;
}

Customer.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    customerName: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    positionX: DataTypes.FLOAT,
    positionY: DataTypes.FLOAT,
    balance: DataTypes.DECIMAL(10,2)
}, {
    // Other model options go here
    sequelize,
    modelName: 'Customer',
});

export default Customer
