const Router = require('express');
const router = new Router();
const merchController = require('../controllers/merchController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', merchController.getInStock);
router.get('/all', roleMiddleware('ADMIN'),merchController.getAll);
router.post('/',  roleMiddleware('ADMIN'), merchController.create);
router.get('/:id', merchController.getOne);
router.delete('/:id', roleMiddleware('ADMIN'), merchController.deleteOne);
router.put('/:id', roleMiddleware('ADMIN'), merchController.updateOne);

module.exports = router;