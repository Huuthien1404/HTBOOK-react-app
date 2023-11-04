const { query } = require("express");
const client = require("../config/api");

const orderController = {
  orderProducts: async (req, res) => {
    client.query(
      `SELECT DISTINCT "Username" from public."Orders" where "Username" = '${req.body.username}';`,
      (err, results) => {
        if (err) throw err;
        if (results.rows.length > 0) {
          client.query(
            `SELECT DISTINCT "Price" from public."Orders" where "Username" = '${req.body.username}' and "ProductID" = ${req.body.productID};`,
            (err, results1) => {
              if (err) throw err;
              if (results1.rows.length > 0) {
                client.query(
                  `UPDATE public."Orders" SET "NumberOfProducts" = "NumberOfProducts" + ${req.body.number} WHERE "Username"='${req.body.username}' and "ProductID"=${req.body.productID};`,
                  (err, results2) => {
                    if (err) throw err;
                    else {
                      res.json({
                        data: "Thêm sản phẩm vào giỏ hàng thành công!",
                      });
                      return;
                    }
                  }
                );
              } else {
                client.query(
                  `INSERT INTO public."Orders"(
                              "ProductID", "Username", "NumberOfProducts", "Price")
                              VALUES (${req.body.productID}, '${req.body.username}', ${req.body.number}, ${req.body.price});`,
                  (err, results3) => {
                    if (err) throw err;
                    else {
                      res.json({
                        data: "Thêm sản phẩm vào giỏ hàng thành công!",
                      });
                      return;
                    }
                  }
                );
              }
            }
          );
        } else {
          client.query(
            `INSERT INTO public."Orders"("ProductID", "Username", "NumberOfProducts", "Price") VALUES (${req.body.productID}, '${req.body.username}', ${req.body.number}, ${req.body.price});`,
            (err, results4) => {
              if (err) throw err;
              else {
                 res.json({
                  data: "Thêm sản phẩm vào giỏ hàng thành công!",
                });
                return;
              }
            }
          );
        }
      }
    );
  },
  showCart: (req, res) => {
    client.query(
      `select tb2."ProductName", tb1."NumberOfProducts", tb1."Price", tb2."ImgUrl"  from public."Orders" as tb1 ,public."Products" as tb2
    where tb1."ProductID" = tb2."ProductID" and tb1."Username" = '${req.body.username}'`,
      (err, results) => {
        if (err) throw err;
        else {
          res.json({
            data: results.rows,
          });
          return;
        }
      }
    );
  },
  checkOut:  (req, res) => {
    for (let item of req.body.items) {
       client.query(
        `select tb1."ProductID" from public."Orders" as tb1, public."Products" as tb2 where tb1."ProductID" = tb2."ProductID" and tb2."ProductName" = '${item.productName}';`,
        (err, results) => {
          if (err) throw err;
          else {
            let proID = results.rows[0].ProductID;
            client.query(
              `DELETE FROM public."Orders" WHERE "ProductID" = ${proID} and "Username" = '${req.body.username}';`,
              (err, results) => {
                if (err) throw err;
                client.query(`UPDATE public."Products"
                SET "Sold"= "Sold" + ${item.number}
                WHERE "ProductName" = '${item.productName}';`, (err, results) => {
                  if (err) throw err;
                })
              }
            );
          }
        }
      );
    }
    res.json({
      data: "Thanh toán thành công!",
    });
    return;
  },
};

module.exports = orderController;
