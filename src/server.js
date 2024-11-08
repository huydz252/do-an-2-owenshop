require('dotenv').config();
const express = require('express');
const session = require('express-session');
const configViewEngine = require('./config/viewEngine');
const route = require('./routes/web');

const connection = require('./config/database');

const app = express()
const port = process.env.PORT || 2302;
const hostname = process.env.HOST_NAME || 'localhost';

configViewEngine(app);

//config req.body
app.use(express.json()) //for json
app.use(express.urlencoded({ extended: true })) //for form data

// Thiết lập middleware cho session
app.use(session({
    secret: '2502',                     // Khóa bảo mật session
    resave: false,                      // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true,            // Tạo session ngay cả khi chưa có dữ liệu
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }  // Thời gian sống của cookie (1 năm)
}));

app.use('/', route)

app.listen(port, hostname, () => {
    console.log(`server running on {`, hostname, ',', port, '}');
})