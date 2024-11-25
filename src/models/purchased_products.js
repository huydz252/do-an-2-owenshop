const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchasedProduct = sequelize.define('PurchasedProduct', {
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'products',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    products: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'M',
    },
}, {
    tableName: 'purchased_products',
    timestamps: true,  // Vô hiệu hóa timestamps để không yêu cầu createdAt và updatedAt
    createdAt: 'created_at',  // Đổi tên `createdAt` thành `created_at`
    updatedAt: 'updated_at'   // Đổi tên `updatedAt` thành `updated_at`
});

module.exports = PurchasedProduct;

