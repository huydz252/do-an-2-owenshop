const connection = require("../config/database");

const getAllUsers = async (req, res) => {
    query = 'select * from products'
    let [results, fields] = await connection.query(query);
    return results;
}

module.exports = {
    getAllUsers
}