require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');
const path = require('path');

const configViewEngine = require('./config/viewEngine');
const route = require('./routes/web');

const app = express()
const port = process.env.PORT || 2302;
const hostname = process.env.HOST_NAME || 'localhost';

configViewEngine(app);

//config req.body
app.use(express.json()) //for json
app.use(express.urlencoded({ extended: true })) //for form data

const options = {
    host: process.env.HOST_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,   // Mật khẩu MySQL của bạn
    database: process.env.DB_NAME  // Tên database bạn đã tạo
};

// Khởi tạo MySQLStore với cấu hình trên
const sessionStore = new MySQLStore(options);

app.use(session({
    key: 'session-cart',         // Tên cookie lưu session
    secret: 'huydeptraivl',          // Chuỗi bí mật cho session
    store: sessionStore,                // Sử dụng MySQLStore để lưu session
    resave: false,                      // Không lưu lại session nếu không có thay đổi
    saveUninitialized: false,           // Không lưu session chưa khởi tạo
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30 * 365    // Thời gian sống của session (ở đây là 1 tháng)
    }
}));

// Cấu hình multer để lưu ảnh vào thư mục imgs/products
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imgs/products');  // Địa chỉ thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname);  // Đặt tên file là <fieldname>.<ext>
    }
});
const upload = multer({ storage: storage });
module.exports = upload;

app.use('/', route)

app.listen(port, hostname, () => {
    console.log(`server running on {`, hostname, ',', port, '}');
})