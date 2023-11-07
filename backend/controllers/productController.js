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
    req.body.filter_product_by_name = req.body.filter_product_by_name.replace("'", "''");
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
  },
  addProductRecord: (req, res) => {
    client.query(`select "ProductID" from public."Products" where "ProductID" = ${Number(req.body.productId)};`, (err, results1) => {
      if (err) throw err;
      if (results1.rows.length > 0) {
        return res.json({
          message: "ProductID đã tồn tại!!!"
        })
      }
      else {
        client.query(`select "ProductID" from public."Products" where "ProductName" = '${req.body.productName}';`, (err, results2) => {
          if (err) throw err;
          if (results2.rows.length > 0) {
            return res.json({
              message: "ProductName đã tồn tại!!!"
            })
          }
          else {
            client.query(`INSERT INTO public."Products"(
              "ProductID", "ProductName", "Author", "KeyFeatures", "Sold", "Price", "ImgUrl")
              VALUES (${Number(req.body.productId)}, '${req.body.productName}', '${req.body.author}', '${req.body.keyFeatures}', ${req.body.sold}, ${req.body.price}, '${req.body.imgUrl}');`, (err, results3) => {
                if (err) throw err;
                client.query(`select* from public."Products"`, (err, results4) => {
                  if (err) throw err;
                  return res.json({
                    message: "Đã thêm 1 sản phẩm thành công!!!",
                    data: results4.rows
                  })
                })
              })
          }
        })
      }
    })
  },
  updateProductRecord: (req, res) => {
    client.query(`UPDATE public."Products"
    SET "ProductName"='${req.body.productName}', "Author"='${req.body.author}', "KeyFeatures"='${req.body.keyFeatures}', "Sold"=${Number(req.body.sold)}, "Price"=${Number(req.body.price)}, "ImgUrl"='${req.body.imgUrl}'
    WHERE "ProductID" = ${req.body.productId}`, (err, resssults) => {
      if (err) throw err;
      client.query(`select* from public."Products" ORDER BY "ProductID" ASC`, (err, results1) => {
        if (err) throw err;
        return res.json({
          message: "Đã cập nhật thông tin của sản phẩm thành công!!!",
          data: results1.rows
        })
      })
    })
  },
  deleteProductRecord: (req, res) => {
    client.query(`DELETE FROM public."Products"
    WHERE "ProductID" = ${req.body.productId};`, (err, results) => {
      if (err) throw err;
      client.query(`select* from public."Products" ORDER BY "ProductID" ASC`, (err, results1) => {
        if (err) throw err;
        return res.json({
          data: results1.rows
        })
      })
    })
  }
};

module.exports = productController;
