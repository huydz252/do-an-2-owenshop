const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ cho ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Chỉ định thư mục lưu trữ ảnh
        cb(null, 'src/public/imgs/products/'); // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Cấu hình multer với bộ lưu trữ trên
const upload = multer({ storage: storage });

// Export middleware upload để sử dụng trong các route
module.exports = upload;
