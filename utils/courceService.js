const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TOKEN_TELEGRAM_ID, { polling: false });

async function sendToTelegram(item) {
    const chatId = process.env.CHAT_ID;

    let text = `
    Запис на курс

    - Имя Фамилия: ${item.name},
    - Телефон: ${item.phone}
    - Курс: ${item.course},
    - Доп. информ.: ${item.information},
    `;

    try {
        await bot.sendMessage(chatId, text);
    } catch (error) {
        console.error(
            "Ошибка при отправке уведомления в телеграм-группу:",
            error
        );
    }
}

module.exports = { sendToTelegram };
