const Router = require('express');
const router = new Router();
const subscribeController = require('../controllers/subscribeController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', roleMiddleware('ADMIN'), subscribeController.getAll);
router.post('/', subscribeController.create)
router.delete('/:id', roleMiddleware('ADMIN'),subscribeController.deleteOne);
router.put('/:id', roleMiddleware('ADMIN'), subscribeController.updateOne);

module.exports = router;