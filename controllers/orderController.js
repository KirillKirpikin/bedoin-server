const ApiError = require('../error/ApiErrir');
const OrderModel = require('../models/order-model');
const {v4: uuidv4} = require('uuid');
const LiqPay = require('../sdk-nodejs-1.4/lib/liqpay')
const axios = require('axios');
const generateOrderNumber = require('../utils/generateOrderNum');

class OrderController {
    async create(req, res, next) {
        
        try {
            const orderData = req.body;
            // orderData.orderId = uuidv4();
            orderData.orderId = generateOrderNumber();
            const order = new OrderModel(orderData);
            const saveOrder = await order.save();
            const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY);
            // const desc = saveOrder.order.map(i=> `${i.title} x ${i.quantity} ${i.select}`).join('\n')
            
            const paymentData = {
                version: '3',
                action:'pay',
                amount: saveOrder.total,
                currency:'UAH',
                description: 'BEDOIN',
                order_id:saveOrder.orderId,
                result_url: 'https://3694-46-98-139-5.ngrok-free.app/api/orders/redirect',
                // server_url:'https://3694-46-98-139-5.ngrok-free.app/api/orders/result',
                // rro_info:{

                //     delivery_emails: [saveOrder.email],
                // }

            }
            const paymentHtml = liqpay.cnb_form(paymentData)
            return res.send(paymentHtml);
         
        } catch (error) {
            console.error("Ошибка при сохранении заказа:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async createOffline(req, res, next){

        try {
            const orderData = req.body;            
            orderData.orderId = generateOrderNumber();
            const order = new OrderModel(orderData);
            const saveOrder = await order.save();


            return res.json(saveOrder.orderId);            
        } catch (e) {
            console.error("Ошибка при сохранении заказа:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async redirect(req, res) {
        res.redirect('http://localhost:3000/result')
    }
    

    // async resultUrl(req, res){
    //     const some = req.body;
    //     console.log(req);
    //     console.log(some);
    //     console.log(signature);        
    //     const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY);   
    //     const expectedSignature = liqpay.str_to_sign(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY);
        

    //     if(signature === expectedSignature){
    //         console.log('TEST TEST TEST TEST TEST TEST' );
    //         console.log(data);
    //     }else{

    //         console.log('Invalid signature');    
    //     }

    // }

    async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.find().sort({orderTime:-1});
            return res.json(orders);
        }catch (e) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteOne(req,res,next){
        try {
            const {id} = req.params;
            const order = await OrderModel.findById(id);
            if (!order) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            let deleteOrder = await OrderModel.findByIdAndDelete(id);
            return res.json(deleteOrder._id);
            
        } catch (error) {
            return res.json({ message: 'Ошибка', error });
            
        }
    }
}

module.exports = new OrderController();