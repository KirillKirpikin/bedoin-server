const Router = require("express");
const router = new Router();
const orderController = require("../controllers/orderController");
const roleMiddleware = require("../middlewaree/roleMiddleware");

router.post("/", orderController.create);
router.post("/mono", orderController.createMono);
router.post("/offline", orderController.createOffline);
router.post("/register-conversion", orderController.registerConversion);
router.get("/", roleMiddleware("ADMIN"), orderController.getAllOrders);
router.post("/redirect", orderController.redirect);
router.post("/webhook", orderController.webhook);
router.delete("/:id", roleMiddleware("ADMIN"), orderController.deleteOne);
router.post("/result", orderController.result);
router.post("/signUp", orderController.singUp);
router.get("/by-order-id/:orderId", orderController.getByOrderId);

module.exports = router;
