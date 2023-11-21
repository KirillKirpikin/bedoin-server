const Router = require('express');
const router = new Router();
const coffeeController = require('../controllers/coffeeController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/all', roleMiddleware('ADMIN'),coffeeController.getAll);
router.get('/', coffeeController.getInStock);
router.post('/', roleMiddleware('ADMIN'),coffeeController.create);
router.get('/:id', coffeeController.getOne);
router.delete('/:id', roleMiddleware('ADMIN'), coffeeController.deleteOne);
router.put('/:id', roleMiddleware('ADMIN'), coffeeController.updateOne);

module.exports = router;
                