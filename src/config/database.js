const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306, // mặc định là 3306 nếu không có port nào được thiết lập
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8mb4'
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
module.exports = sequelize;

// k dung sequelize
// const connection = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT, // mặc định: 3306
//     user: process.env.DB_USER,  // mặc định: trống
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     charset: 'utf8mb4',
//     waitForConnections: true,
//     connectionLimit: 10, // Số kết nối tối đa
//     queueLimit: 0        // Không giới hạn hàng đợi
// });