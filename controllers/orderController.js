const ApiError = require("../error/ApiErrir");
const crypto = require("crypto");
const OrderModel = require("../models/order-model");
const { v4: uuidv4 } = require("uuid");
const LiqPay = require("../sdk-nodejs-1.4/lib/liqpay");
const axios = require("axios");
const generateOrderNumber = require("../utils/generateOrderNum");
const { sendTelegramMessage } = require("../utils/emailService");
const { sendToTelegram } = require("../utils/courceService");

class OrderController {
    async create(req, res, next) {
        try {
            const orderData = req.body;
            let rro = {
                items: orderData.order.map((item) => ({
                    amount: item.quantity, // Количество товара
                    price: +item.price, // Цена за единицу
                    cost: item.quantity * item.price, // Общая стоимость
                    id: item.id ? +item.id : 0, // ID товара
                })),
                delivery_emails: [orderData.email, "coffeebedouin@gmail.com"],
            };

            // console.log(rro);
            orderData.orderId = generateOrderNumber();
            const order = new OrderModel(orderData);
            const saveOrder = await order.save();
            const liqpay = new LiqPay(
                process.env.LIQPAY_PUBLIC_KEY,
                process.env.LIQPAY_PRIVATE_KEY
            );
            const paymentData = {
                version: "3",
                action: "pay",
                amount: saveOrder.total,
                currency: "UAH",
                description: "BEDOIN",
                order_id: saveOrder.orderId,
                server_url: "https://bedoin.com.ua/api/orders/redirect",
                result_url: `https://bedoin.com.ua/result?orderId=${order.orderId}&total=${order.total}`,
                rro_info: JSON.stringify(rro),
            };
            const paymentHtml = liqpay.cnb_form(paymentData);
            return res.send(paymentHtml);
        } catch (error) {
            console.error("Ошибка при сохранении заказа:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async createOffline(req, res, next) {
        try {
            const orderData = req.body;
            orderData.orderId = generateOrderNumber();
            const order = new OrderModel(orderData);
            sendTelegramMessage(order);
            const saveOrder = await order.save();
            return res.json({
                orderId: saveOrder.orderId,
                total: saveOrder.total,
            });
        } catch (error) {
            console.error("Ошибка при сохранении заказа:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async singUp(req, res) {
        try {
            const singUpData = req.body;
            sendToTelegram(singUpData);
            return res.json({
                message: " Дякуємо, ми звяжемося з вами найближчим часом!",
            });
        } catch (error) {
            return res.json({ message: "Ошибка", error });
        }
    }

    async redirect(req, res) {
        const { data, signature } = req.body;

        // Проверка подлинности запроса
        const liqpay = new LiqPay(
            process.env.LIQPAY_PUBLIC_KEY,
            process.env.LIQPAY_PRIVATE_KEY
        );

        const expectedSignature = liqpay.str_to_sign(
            process.env.LIQPAY_PRIVATE_KEY +
                data +
                process.env.LIQPAY_PRIVATE_KEY
        );

        if (signature !== expectedSignature) {
            return res.status(403).json({ message: "Invalid signature" });
        }

        // Декодирование данных
        const decodedData = Buffer.from(data, "base64").toString("utf-8");
        const { order_id, status } = JSON.parse(decodedData);

        try {
            // Поиск заказа по order_id в базе данных
            const order = await OrderModel.findOne({ orderId: order_id });

            if (!order) {
                return res.status(404).json({ message: "Заказ не найден" });
            }

            if (status === "success") {
                // order.paymentStatus = 'paid';
                sendTelegramMessage(order);
                await order.save();
            } else {
                await OrderModel.findByIdAndDelete(order._id);
            }

            // Перенаправление клиента на страницу результатов
            return res.redirect(
                `https://bedoin.com.ua/result?orderId=${order.orderId}&total=${order.total}`
            ); // Замените на URL вашего React-приложения
        } catch (error) {
            const order = await OrderModel.findOne({ orderId: order_id });
            if (order) {
                await OrderModel.findByIdAndDelete(order._id);
            }
            return res.redirect("https://bedoin.com.ua/");
        }
    }

    async result(req, res) {
        res.redirect("https://bedoin.com.ua/result"); // Замените на URL вашего React-приложения
    }

    async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.find().sort({ orderTime: -1 });
            return res.json(orders);
        } catch (e) {
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteOne(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderModel.findById(id);
            if (!order) {
                return res.status(404).json({ message: "Запись не найдена" });
            }
            let deleteOrder = await OrderModel.findByIdAndDelete(id);
            return res.json(deleteOrder._id);
        } catch (error) {
            return res.json({ message: "Ошибка", error });
        }
    }

    async registerConversion(req, res) {
        try {
            const { orderId, tariffParam } = req.body;
            const SAuid = req.cookies?.SAuid; // ID пользователя из cookies
            const utmSource = req.cookies?.utm_source;

            console.log("super");
            console.log(orderId, tariffParam);
            console.log(SAuid, utmSource);

            if (!SAuid || utmSource !== "sellaction.net") {
                return res
                    .status(400)
                    .json({ error: "Invalid SAuid or source" });
            }

            const tariffId = 4819; // Указанный tariff_id для оплаченного заказа
            const url = `https://sellaction.net/reg.php?id=${SAuid}-${tariffId}_${tariffParam}&order_id=${orderId}`;

            const response = await axios.get(url);
            return res.json({
                message: "Conversion registered",
                data: 1,
            });
        } catch (error) {
            console.error("Error registering conversion:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new OrderController();
