const client = require("../config/api");

const showController = {
    showAllUsersProductsOrders: (req, res) => {
        client.query(`SELECT "Username", "Email", "Role"
        FROM public."Users";`, (err, results1) => {
            if (err) throw err;
            client.query(`SELECT "ProductID", "ProductName", "Author", "KeyFeatures", "Sold", "Price", "ImgUrl"
            FROM public."Products" ORDER BY "ProductID" ASC;`, (err, results2) => {
                if (err) throw err;
                client.query(`SELECT "OrderID", "ProductID", "Username", "NumberOfProducts", "Price"
                FROM public."Orders";`, (err, results3) => {
                    if (err) throw err;
                    return res.json({
                        users: results1.rows,
                        products: results2.rows,
                        orders: results3.rows
                    })
                })
            })
        })
    }
}

module.exports = showController;