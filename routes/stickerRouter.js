const Router = require('express');
const router = new Router();
const stickerController =  require('../controllers/stickerController');
const roleMiddleware = require('../middlewaree/roleMiddleware');

router.get('/', stickerController.getAll);
router.post('/', roleMiddleware('ADMIN'),stickerController.create);
router.delete('/:id', roleMiddleware('ADMIN'),stickerController.deleteOne);

module.exports = router;