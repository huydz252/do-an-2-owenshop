const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }, password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    cart: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    tableName: 'users',
    timestamps: false,  // Vô hiệu hóa tự động thêm createdAt, updatedAt
})

module.exports = User