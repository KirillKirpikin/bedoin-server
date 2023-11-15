const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const roleMiddleware = require('../middlewaree/roleMiddleware');


router.post('/', orderController.create);
router.post('/offline', orderController.createOffline);
router.get('/', roleMiddleware('ADMIN'),orderController.getAllOrders);
router.post('/redirect', orderController.redirect);
router.delete('/:id', roleMiddleware('ADMIN'),orderController.deleteOne);
// router.post('/result', orderController.resultUrl);

module.exports = router;
