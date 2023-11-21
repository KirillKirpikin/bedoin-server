const ApiError = require('../error/ApiErrir');
const crypto = require('crypto');
const OrderModel = require('../models/order-model');
const {v4: uuidv4} = require('uuid');
const LiqPay = require('../sdk-nodejs-1.4/lib/liqpay')
const axios = require('axios');
const generateOrderNumber = require('../utils/generateOrderNum');
const { sendTelegramMessage } = require('../utils/emailService');

class OrderController {
    async create(req, res, next) {
        
        try {
            const orderData = req.body;
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
                order_id: saveOrder.orderId,
                server_url:'https://1603-46-98-139-214.ngrok-free.app/api/orders/redirect',
                // result_url: 'https://1603-46-98-139-214.ngrok-free.app/api/orders/redirect',
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
            sendTelegramMessage(order)
            const saveOrder = await order.save();
            return res.json(saveOrder.orderId);            
        } catch (error) {
            console.error("Ошибка при сохранении заказа:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async redirect(req, res) {
        const { data, signature } = req.body;

        console.log('Received LiqPay request:');
        console.log('Data:', data);
        console.log('Signature:', signature);

        // Проверка подлинности запроса
        const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY);

        const expectedSignature = liqpay.str_to_sign(process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY);

        if (signature !== expectedSignature) {
            return res.status(403).json({ message: 'Invalid signature' });
        }

        // Декодирование данных
        const decodedData = Buffer.from(data, 'base64').toString('utf-8');
        const { order_id, status } = JSON.parse(decodedData);

        try {
            // Поиск заказа по order_id в базе данных
            const order = await OrderModel.findOne({ orderId: order_id });

            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }
            
            if (status === 'success') {
                order.paymentStatus = 'paid';
                sendTelegramMessage(order);                
            } else {
                order.paymentStatus = 'failed';
            }

            await order.save();

            // Перенаправление клиента на страницу результатов
            res.redirect('http://localhost:3000/result'); // Замените на URL вашего React-приложения
        } catch (error) {
            console.error("Ошибка при обновлении статуса оплаты:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async result(req,res){
        res.redirect('http://localhost:3000/result');// Замените на URL вашего React-приложения
    }


   

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



 // async redirect(req, res) {
    //     console.log(req.body);
    //     console.log(req.params);

    //     // console.log(ord);

    //     try {
    //         // const order = await OrderModel.findOne({orderId: order_id});
    //         // if (!order) {
    //         //     return res.status(404).json({ message: 'Заказ не найден' });
    //         // }

    //         // if (status === 'success') {
    //         //     order.paymentStatus = 'paid';
    //         // } else {
    //         //     order.paymentStatus = 'failed';
    //         // }
    //         // await order.save();
    //         res.redirect('http://localhost:3000/result')

    //     } catch (error) {
    //         console.error("Ошибка при обновлении статуса оплаты:", error);
    //         return res.status(500).json({ error: 'Internal server error' });
    //     }
    // }
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