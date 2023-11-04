const router = require("express").Router();
const commentController = require("../controllers/commentController");


router.post("/v1/show-all-comment-by-product", commentController.getAllCommentByProductController);
router.post("/v1/show-evaluate-by-product", commentController.getEvaluateByProductController);


module.exports = router;