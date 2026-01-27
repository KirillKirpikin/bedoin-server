const TelegramBot = require("node-telegram-bot-api");
const formatDateTime = require("./formData");
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM_ID, { polling: false });

async function sendTelegramMessage(order) {
    const chatId = process.env.CHAT_ID;
    const timeOrd = formatDateTime(order.orderTime);

    const getPayInfo = (pay) => {
        switch (pay) {
            case "OnlinePayMono":
                return "Через Monobank";
            case "OnlinePay":
                return "Через LiqPay";
            case "Cash":
                return "При получении";
            case "ScorePay":
                return "На разрохунковый рахунок";
        }
    };

    const getDeliveryInfo = (order) => {
        switch (order.delivery) {
            case "NovaPost":
                return `Доставка: Нова Пошта\n
        Оплата: ${getPayInfo(order.payment)}\n
        Город: ${order.city}\nОтделение: ${order.warehouses}`;
            case "RozetkaPost":
                return `Доставка: Rozetka Delivery\n
        Оплата: ${getPayInfo(order.payment)}\n
        Город: ${order.city}\n Отделение: ${order.warehouses}`;
            case "Courier":
                return `Доставка: Курьерская доставка\n
        Оплата: ${getPayInfo(order.payment)}`;
            case "Pickup":
                return `Доставка: Самовывоз\n
        Оплата: ${getPayInfo(order.payment)}`;
            default:
                return ""; // Обработка для других случаев доставки, если необходимо
        }
    };

    let text = `
Номер заказа: ${order.orderId},
Дата: ${timeOrd}
Информация про покупателя:
- Имя Фамилия: ${order.firstName}, ${order.lastName},
- Email: ${order.email},
- Доп. информ.: ${order.info},
- Телефон: ${order.phone}
${order.isConversion ? " - Sellaction" : ""}

Заказанные товары:
${order.order
    .map(
        (item) => `
- Название: ${item.title},
  Упаковка: ${item.packing},
  Количество: ${item.quantity},
  Выбор: ${item.select}
`
    )
    .join("\n")}

Общая сумма заказа: ${order.total} грн.
Promo: ${order.promo ? order.promo : "без"}

Доставка:
${getDeliveryInfo(order)}
  `;

    try {
        await bot.sendMessage(chatId, text);
        console.log("Уведомление успешно отправлено в телеграм-группу");
    } catch (error) {
        console.error(
            "Ошибка при отправке уведомления в телеграм-группу:",
            error
        );
    }
}

module.exports = { sendTelegramMessage };

//-4014804680
