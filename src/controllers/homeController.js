const connection = require("../config/database");
const { getAllUsers } = require('../services/CRUDService')

//homepage
const getHomepage = async (req, res) => {
    let results = await getAllUsers(); //vì hàm getAllUsers là hàm bất đồng bộ, nên phải chờ ('await') nó thực hiện xong thì mới thực hiện các câu lệnh dưới
    return res.render('home.ejs', { rows: results });
}
const getShop = async () => {
    let results = await getAllUsers();
    return res.render('shop.ejs', { rows: results });
}
const getLogin = async (req, res) => {
    res.send('getLogin')
}
const getAdminLogin = async (req, res) => {
    res.send('getAdminLogin')
}
const getAdminAddProducts = async (req, res) => {

}

module.exports = {
    getHomepage, getShop, getLogin, getAdminLogin,
    getAdminAddProducts
}