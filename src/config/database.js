const mysql = require('mysql2/promise');
require('dotenv').config();
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // mặc định: 3306
    user: process.env.DB_USER,  // mặc định: trống
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10, // Số kết nối tối đa
    queueLimit: 0        // Không giới hạn hàng đợi
});
module.exports = connection;