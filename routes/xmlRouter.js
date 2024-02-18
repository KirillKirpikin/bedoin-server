const Router = require('express');
const router = new Router();
const xmlController = require('../controllers/xmlController')

router.get('/', xmlController.get)

module.exports = router;