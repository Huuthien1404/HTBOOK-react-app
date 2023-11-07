const router = require("express").Router();
const showController = require("../controllers/showController");

router.get("/v1/show-all-users-products-orders", showController.showAllUsersProductsOrders);
module.exports = router;