const Router = require('express');
const router = new Router();
const lemonadeController = require('../controllers/lemonadeController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', lemonadeController.getInStock);
router.get('/all', roleMiddleware('ADMIN'),lemonadeController.getAll);
router.post('/',  roleMiddleware('ADMIN'), lemonadeController.create);
router.get('/:id', lemonadeController.getOne);
router.delete('/:id', roleMiddleware('ADMIN'), lemonadeController.deleteOne);
router.put('/:id', roleMiddleware('ADMIN'), lemonadeController.updateOne);

module.exports = router;