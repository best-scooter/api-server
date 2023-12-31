import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'

class Customer extends Model<
    InferAttributes<Customer>,
    InferCreationAttributes<Customer>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare customerName: string | null;
    declare email: string;
    declare positionX: number | null;
    declare positionY: number | null;
    declare balance: number | null;
    declare connected: boolean | null;
    declare customerId: CreationOptional<number>;
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
        allowNull: false,
        unique: true
    },
    positionX: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    positionY: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    connected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    customerId: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        },
        set(value) {
            throw new Error("Cannot set customerId property, use 'id' instead.")
        }
    }
}, {
    // Other model options go here
    sequelize,
    modelName: 'Customer',
});

export default Customer
