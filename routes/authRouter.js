const Router = require('express');
const router = new Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewaree/authMiddleware');
const {check} = require("express-validator");

router.post('/registration', [
    check('username', 'Имя поьзователя не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть боьше 5 символов').isLength({min:4}),
], authController.registration);
router.post('/login', authController.login);
router.get('/', authMiddleware, authController.check);

module.exports = router;