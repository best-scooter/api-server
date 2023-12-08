import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import sequelize from './Sequelize'

class Admin extends Model<
    InferAttributes<Admin>,
    InferCreationAttributes<Admin>
> {
    declare id: CreationOptional<number>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare username: string;
    declare password: string;
    declare level: string | null;
    declare adminId: CreationOptional<number>;
}

Admin.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: DataTypes.STRING,
    adminId: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.id;
        },
        set(value) {
            throw new Error("Cannot set adminId property, use 'id' instead.")
        }
    }
}, {
    // Other model options go here
    sequelize,
    modelName: 'Admin',
});

export default Admin
