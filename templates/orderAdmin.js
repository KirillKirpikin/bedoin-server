const formatDateTime = require("../utils/formData");

function orderAdminTemplate(order) {
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
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; text-align: center;">${item.select || "—"}</td>
                <td style="padding: 10px 12px; border-bottom: 1px solid #e8e8e8; text-align: right; color: #c7a17a; font-weight: bold;">${item.price * item.quantity} грн</td>
            </tr>
        `
        )
        .join("");

    const deliveryDetails = () => {
        switch (order.delivery) {
            case "NovaPost":
            case "RozetkaPost":
                return `
                <tr>
                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Місто:</td>
                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${order.city || "—"}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Відділення:</td>
                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${order.warehouses || "—"}</td>
                </tr>`;
            default:
                return "";
        }
    };

    return `
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>Нове замовлення</title>
    <style>:root { color-scheme: light only; }</style>
</head>
<body style="margin:0; padding:0; background-color:#f9f9f9; font-family: Arial, sans-serif; color: #000000;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9; padding: 30px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 24px 32px; text-align: center; border-bottom: 3px solid #000000; border-top: 3px solid #000000;">
                            <img src="https://bedoincoffee.ua/logo.png" alt="BEDOIN COFFEE" width="180" style="display:block; margin: 0 auto;" />
                        </td>
                    </tr>

                    <!-- Alert -->
                    <tr>
                        <td style="background-color: #415167; padding: 14px 32px; text-align: center;">
                            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: bold; letter-spacing: 1px;">
                                НОВЕ ЗАМОВЛЕННЯ #${order.orderId}
                            </p>
                            <p style="margin: 4px 0 0; color: #c7a17a; font-size: 12px;">${timeOrd}</p>
                        </td>
                    </tr>

                    <!-- Customer Info -->
                    <tr>
                        <td style="padding: 20px 32px 8px;">
                            <p style="margin: 0 0 10px; font-weight: bold; font-size: 15px; color: #415167;">Покупець:</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border-radius: 6px; padding: 16px;">
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Ім'я:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${order.firstName} ${order.lastName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Телефон:</td>
                                    <td style="padding: 6px 12px; font-size: 13px;">
                                        <a href="tel:${order.phone}" style="color: #415167; text-decoration: none; font-weight: bold;">${order.phone}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Email:</td>
                                    <td style="padding: 6px 12px; font-size: 13px;">
                                        <a href="mailto:${order.email}" style="color: #415167; text-decoration: none;">${order.email}</a>
                                    </td>
                                </tr>
                                ${order.info ? `<tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Коментар:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${order.info}</td>
                                </tr>` : ""}
                                ${order.isConversion ? `<tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Джерело:</td>
                                    <td style="padding: 6px 12px; color: #c7a17a; font-size: 13px; font-weight: bold;">Sellaction</td>
                                </tr>` : ""}
                            </table>
                        </td>
                    </tr>

                    <!-- Delivery Info -->
                    <tr>
                        <td style="padding: 8px 32px;">
                            <p style="margin: 0 0 10px; font-weight: bold; font-size: 15px; color: #415167;">Доставка і оплата:</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9f9f9; border-radius: 6px; padding: 16px;">
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Доставка:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${deliveryLabel}</td>
                                </tr>
                                ${deliveryDetails()}
                                <tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Оплата:</td>
                                    <td style="padding: 6px 12px; color: #000000; font-size: 13px;">${paymentLabel}</td>
                                </tr>
                                ${order.promo ? `<tr>
                                    <td style="padding: 6px 12px; color: #666666; font-size: 13px;">Промокод:</td>
                                    <td style="padding: 6px 12px; color: #c7a17a; font-size: 13px; font-weight: bold;">${order.promo}</td>
                                </tr>` : ""}
                            </table>
                        </td>
                    </tr>

                    <!-- Items Table -->
                    <tr>
                        <td style="padding: 8px 32px 16px;">
                            <p style="margin: 0 0 10px; font-weight: bold; font-size: 15px; color: #415167;">Товари:</p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; font-size: 13px;">
                                <thead>
                                    <tr style="background-color: #000000; color: #c7a17a;">
                                        <th style="padding: 10px 12px; text-align: left; font-weight: normal;">Товар</th>
                                        <th style="padding: 10px 12px; text-align: center; font-weight: normal;">Пакув.</th>
                                        <th style="padding: 10px 12px; text-align: center; font-weight: normal;">Кіл.</th>
                                        <th style="padding: 10px 12px; text-align: center; font-weight: normal;">Вибір</th>
                                        <th style="padding: 10px 12px; text-align: right; font-weight: normal;">Сума</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsRows}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="4" style="padding: 14px 12px; text-align: right; font-weight: bold; font-size: 14px; color: #000000;">Разом:</td>
                                        <td style="padding: 14px 12px; text-align: right; font-weight: bold; font-size: 18px; color: #c7a17a;">${order.total} грн</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #000000; padding: 16px 32px; text-align: center;">
                            <p style="margin: 0; color: #555555; font-size: 11px;">© BEDOIN — bedoincoffee.ua</p>
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

module.exports = orderAdminTemplate;
