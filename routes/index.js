const Router = require('express').Router;
const router = new Router();
const coffeeRouter = require('./coffeeRouter');
const orderRouter = require('./orderRouter');
const dripRouter = require('./dripRouter');
const merchRouter = require('./merchRouter');
const lemonadeRouter = require('./lemonadeRouter');
const authRouter = require('./authRouter');

router.use('/coffee', coffeeRouter);
router.use('/orders', orderRouter);
router.use('/drip', dripRouter);
router.use('/merch', merchRouter);
router.use('/lemonade', lemonadeRouter);
router.use('/auth', authRouter);

module.exports = router;