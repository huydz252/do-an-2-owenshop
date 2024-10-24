const express = require('express') //import express
const app = express() // tạo express application
const port = 3000 // init port
//khai báo routes
//req (request), res(response) là 2 object trong môi trường Node.js
app.get('/', (req, res) => {
    res.send('Hello World!')
})
//run server trên port đã khởi tạo trước đấy
//nạp các thông tin khai báo ở trên rồi chạy (ví dụ như nạp routes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})