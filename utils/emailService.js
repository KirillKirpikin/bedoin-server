const TelegramBot = require("node-telegram-bot-api");
const formatDateTime = require("./formData");
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM_ID, { polling: false });

const escapeHtml = (value) =>
    String(value ?? "").replace(
        /[&<>]/g,
        (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch])
    );

const getPayInfo = (pay) => {
    switch (pay) {
        case "OnlinePayMono":
            return "Через Monobank";
        case "OnlinePay":
            return "Через LiqPay";
        case "Cash":
            return "При отриманні";
        case "ScorePay":
            return "На розрахунковий рахунок";
        default:
            return pay;
    }
};

const getDeliveryInfo = (order) => {
    const payLine = `Оплата: ${getPayInfo(order.payment)}`;

    switch (order.delivery) {
        case "NovaPost": {
            const mode =
                order.novaPostType === "Courier" ? "кур'єр" : "відділення";
            const addressLine =
                order.novaPostType === "Courier"
                    ? `Адреса: ${escapeHtml(order.street)} ${escapeHtml(
                          order.house
                      )}`
                    : `Відділення: ${escapeHtml(order.warehouses)}`;
            const deliveryPayLine = `Оплата доставки: ${
                order.deliveryCostIncluded
                    ? `так (${order.deliveryCost} грн)`
                    : "ні"
            }`;

            return [
                `Спосіб: Нова Пошта (${mode})`,
                payLine,
                `Місто: ${escapeHtml(order.city)}`,
                addressLine,
                deliveryPayLine,
            ].join("\n");
        }
        case "RozetkaPost":
            return [
                "Спосіб: Rozetka Delivery",
                payLine,
                `Місто: ${escapeHtml(order.city)}`,
                `Відділення: ${escapeHtml(order.warehouses)}`,
            ].join("\n");
        case "Courier":
            return [
                "Спосіб: Кур'єрська доставка",
                payLine,
                `Адреса: ${escapeHtml(order.courierAddress)}`,
            ].join("\n");
        case "Pickup":
            return ["Спосіб: Самовивіз", payLine].join("\n");
        default:
            return payLine;
    }
};

async function sendTelegramMessage(order) {
    const chatId = process.env.CHAT_ID;
    const timeOrd = formatDateTime(order.orderTime);

    const itemsList = order.order
        .map(
            (item) =>
                `• ${escapeHtml(item.title)} — ${item.packing}, ${
                    item.quantity
                } шт.${item.select ? `, ${escapeHtml(item.select)}` : ""}`
        )
        .join("\n\n");

    const text = [
        `🛒 <b>Замовлення #${escapeHtml(order.orderId)}</b>`,
        `🕒 ${timeOrd}`,
        "",
        "👤 <b>Клієнт</b>",
        `Ім'я: ${escapeHtml(order.firstName)} ${escapeHtml(order.lastName)}`,
        `Телефон: ${escapeHtml(order.phone)}`,
        `Email: ${escapeHtml(order.email)}`,
        order.info ? `Доп. інформація: ${escapeHtml(order.info)}` : null,
        order.isConversion ? "🔖 Sellaction" : null,
        "",
        "📦 <b>Товари</b>",
        itemsList,
        "",
        `💰 Разом: <b>${order.total} грн</b>`,
        order.promo ? `Promo: ${escapeHtml(order.promo)}` : null,
        "",
        "🚚 <b>Доставка</b>",
        getDeliveryInfo(order),
    ]
        .filter((line) => line !== null)
        .join("\n");

    try {
        await bot.sendMessage(chatId, text, { parse_mode: "HTML" });
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
