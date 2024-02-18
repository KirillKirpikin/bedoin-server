const Router = require('express');
const router = new Router();
const promoController = require('../controllers/promoController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', roleMiddleware('ADMIN'), promoController.getAll)
router.post('/', roleMiddleware('ADMIN'),promoController.create);
router.post('/check', promoController.checkPromo);
router.delete('/:id', roleMiddleware('ADMIN'), promoController.deleteOne);

module.exports = router;