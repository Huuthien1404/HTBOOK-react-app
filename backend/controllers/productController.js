const { query } = require("express");
const client = require("../config/api");

const productController = {
  showAllProducts: (req, res) => {
    client.query(`select * from public."Products" order by "ProductID" asc;`, (err, results) => {
      if (err) throw err;
      else {
        return res.json({
          data: results.rows,
        });
      }
    });
  },
  showPopularProducts: (req, res) => {
    client.query(`select tb1.* from public."Products" as tb1, public."TopProducts" as tb2 where tb1."ProductID" = tb2."TopProductID"
    order by tb2."NumberOrder" desc
    limit 50;`, (err, results) => {
      if (err) throw err;
      return res.json({
        data: results.rows,
      }); 
    })
  },
  showProductsByName: (req, res) => {
    client.query(
      `SELECT "ProductID", "ProductName", "Author", "KeyFeatures", "Sold", "Price", "ImgUrl" FROM public."Products" where "ProductName" LIKE '%${req.body.filter_product_by_name}%';`,
      (err, results) => {
        if (err) throw err;
        else {
          return res.json({
            data: results.rows,
          });
        }
      }
    );
  },
  checkProductInCart: (req, res) => {
    client.query(
      `select DISTINCT "Username" from public."Orders" where "Username" = '${req.body.username}';`,
      (err, results) => {
        if (err) throw err;
        if (results.rows.length > 0) {
          return res.json({
            data: "contain product",
          });
        } else {
          return res.json({
            data: "not contain product",
          });
        }
      }
    );
  },
  addPopularProduct: (req, res) => {
    client.query(`select * from public."TopProducts" where "TopProductID" = ${req.body.product_name.ProductID};`, (err, results) => {
      if (err) throw err;
      if (results.rows.length === 0) {
        client.query(`INSERT INTO public."TopProducts"(
          "TopProductID")
          VALUES (${req.body.product_name.ProductID});`, (err, results1) => {
            if (err) throw err;
            return res.json({
              data: "Added product to popular successful"
            });
          })
      }
      else {
        return res.json({
          data: "Product is added to popular before"
        });
      }
    })
  },
  getPopularProductByName: (req, res) => {
    client.query(`select * from public."Products" where "ProductName" = '${req.body.product_name}';`, (err, results) => {
      if (err) throw err;
      return res.json(results.rows[0]);
    })
  }
};

module.exports = productController;
