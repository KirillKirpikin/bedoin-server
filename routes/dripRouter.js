const Router = require('express');
const router = new Router();
const dripController = require('../controllers/dripController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', dripController.getInStock);
router.get('/all', roleMiddleware('ADMIN'),dripController.getAll);
router.post('/',  roleMiddleware('ADMIN'), dripController.create);
router.get('/:id', dripController.getOne);
router.delete('/:id', roleMiddleware('ADMIN'), dripController.deleteOne);
router.put('/:id', roleMiddleware('ADMIN'), dripController.updateOne);

module.exports = router;