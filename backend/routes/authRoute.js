const router = require("express").Router();
const authController = require("../controllers/authController");


router.post("/v1/sign-in", authController.signInController);
router.post("/v1/sign-up", authController.signUpController);
router.get("/v1/logged-in", authController.loggedInController);
router.get("/v1/log-out", authController.logOutController);
router.post("/v1/change-password", authController.changePassword);

module.exports = router;