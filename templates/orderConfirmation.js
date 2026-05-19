const formatDateTime = require("../utils/formData");

function orderConfirmationTemplate(order) {
    const timeOrd = formatDateTime(order.orderTime);

    const deliveryLabels = {
        NovaPost: "Нова Пошта",
        RozetkaPost: "Rozetka Delivery",
        Courier: "Кур'єрська доставка",
        Pickup: "Самовивіз",
    };

    const paymentLabels = {
        OnlinePayMono: "Через Monobank",
        OnlinePay: "Через LiqPay",
        Cash: "При отриманні",
        ScorePay: "На розрахунковий рахунок",
    };

    const deliveryLabel = deliveryLabels[order.delivery] || order.delivery;
    const paymentLabel = paymentLabels[order.payment] || order.payment;

    const itemsRows = order.order
        .map(
            (item) => `
            <tr>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8;">${item.title}</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; text-align: center;">${item.packing} г</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; text-align: center;">${item.quantity} шт.</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; text-align: right; color: #c7a17a; font-weight: bold;">${item.price * item.quantity} грн</td>
            </tr>
        `
        )
        .join("");

    return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>Підтвердження замовлення</title>
    <style>:root { color-scheme: light only; }</style>
</head>
<body style="margin:0; padding:0; background-color:#f9f9f9; font-family: Arial, sans-serif; color: #000000;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding: 30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Header: white bg with logo -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 28px 32px; text-align: center; border-bottom: 3px solid #000000; border-top: 3px solid #000000;">
                            <img src="https://bedoincoffee.ua/logo.png" alt="BEDOIN COFFEE" width="200" style="display:block; margin: 0 auto;" />
                            <p style="margin: 10px 0 0; color: #415167; font-size: 12px; letter-spacing: 1px;">Виробництво і продаж якісної кави в Україні</p>
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td style="padding: 32px 32px 16px; text-align: center;">
                            <h2 style="margin: 0; font-size: 20px; color: #415167;">Дякуємо за замовлення!</h2>
                            <p style="margin: 10px 0 0; color: #666666; font-size: 14px;">
                                Ми отримали ваше замовлення і вже починаємо його обробку.
                            </p>
                        </td>
                    </tr>

                    <!-- Order Info -->
                    <tr>
                        <td style="padding: 16px 32px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border-radius: 6px; padding: 16px;">
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Номер замовлення:</td>
                                    <td style="padding: 6px 12px; font-weight: bold; color: #415167; font-size: 13px;">${order.orderId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Дата:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${timeOrd}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Доставка:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${deliveryLabel}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Оплата:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${paymentLabel}</td>
                                </tr>
                                ${order.promo ? `<tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Промокод:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${order.promo}</td>
                                </tr>` : ""}
                            </table>
                        </td>
                    </tr>

                    <!-- Items Table -->
                    <tr>
                        <td style="padding: 8px 32px 16px;">
                            <p style="margin: 0 0 10px; font-weight: bold; font-size: 15px; color: #415167;">Ваше замовлення:</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
                                <thead>
                                    <tr style="background-color: #000000; color: #c7a17a;">
                                        <th style="padding: 10px 12px; text-align: left; font-weight: normal;">Товар</th>
                                        <th style="padding: 10px 12px; text-align: center; font-weight: normal;">Пакування</th>
                                        <th style="padding: 10px 12px; text-align: center; font-weight: normal;">Кількість</th>
                                        <th style="padding: 10px 12px; text-align: right; font-weight: normal;">Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsRows}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" style="padding: 14px 12px; text-align: right; font-weight: bold; font-size: 14px; color: #000000;">Разом:</td>
                                        <td style="padding: 14px 12px; text-align: right; font-weight: bold; font-size: 16px; color: #c7a17a;">${order.total} грн</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #000000; padding: 24px 32px; text-align: center;">
                            <!-- Instagram button -->
                            <a href="https://www.instagram.com/bedoincoffee/" target="_blank"
                               style="display:inline-block; margin-bottom: 14px; padding: 10px 24px; background-color: #c7a17a; color: #000000; text-decoration: none; font-size: 13px; font-weight: bold; border-radius: 4px; letter-spacing: 0.5px;">
                                Instagram @bedoincoffee
                            </a>
                            <br/>
                            <a href="tel:+380675001303" style="color: #c7a17a; text-decoration: none; font-size: 14px; font-weight: bold;">
                                +38 (067) 500-13-03
                            </a>
                            <br/>
                            <p style="margin: 12px 0 0; color: #888888; font-size: 12px;">
                                Питання? Пишіть на <a href="mailto:coffeebedouin@gmail.com" style="color: #c7a17a; text-decoration: none;">coffeebedouin@gmail.com</a>
                            </p>
                            <p style="margin: 8px 0 0; color: #555555; font-size: 11px;">© BEDOIN — Виробництво і продаж якісної кави в Україні</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

module.exports = orderConfirmationTemplate;
