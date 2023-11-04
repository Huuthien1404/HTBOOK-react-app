const productController = require("../controllers/productController");
const router = require("express").Router();

router.get("/v1/show-popular-products", productController.showPopularProducts);
router.get("/v1/show-all-products", productController.showAllProducts);
router.post("/v1/filter-product-by-name", productController.showProductsByName);
router.post("/v1/contain-product-in-cart", productController.checkProductInCart);
router.post("/v1/add-to-popular-product", productController.addPopularProduct);
router.post("/v1/get-popular-product-by-name", productController.getPopularProductByName);
module.exports = router;