const sequelize = require('./config/database');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Kết nối cơ sở dữ liệu thành công!');
    } catch (error) {
        console.error('Không thể kết nối cơ sở dữ liệu:', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
