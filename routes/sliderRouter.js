const Router = require('express');
const router = new Router();
const sliderController =  require('../controllers/sliderController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', sliderController.getAll);
router.post('/', roleMiddleware('ADMIN'),sliderController.create);
router.delete('/:id', roleMiddleware('ADMIN'),sliderController.deleteOne);

module.exports = router;