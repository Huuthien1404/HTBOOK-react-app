const orderController = require("../controllers/orderController");
const router = require("express").Router();

router.post("/v1/add-to-cart", orderController.orderProducts);
router.post("/v1/show-cart", orderController.showCart);
router.post("/v1/check-out", orderController.checkOut);
module.exports = router;