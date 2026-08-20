const Router = require("express");
const router = new Router();
const limitedCoffeeController = require("../controllers/limitedCoffeeController");
const roleMiddleware = require("../middlewaree/roleMiddleware");

router.get("/", limitedCoffeeController.getInStock);
router.get("/all", roleMiddleware("ADMIN"), limitedCoffeeController.getAll);
router.post("/", roleMiddleware("ADMIN"), limitedCoffeeController.create);
router.get("/:id", limitedCoffeeController.getOne);
router.delete("/:id", roleMiddleware("ADMIN"), limitedCoffeeController.deleteOne);
router.put("/:id", roleMiddleware("ADMIN"), limitedCoffeeController.updateOne);

module.exports = router;
