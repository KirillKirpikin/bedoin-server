const Router = require("express");
const router = new Router();
const productController = require("../controllers/productController");
router.post("/by-refs", productController.getByRefs);

module.exports = router;
