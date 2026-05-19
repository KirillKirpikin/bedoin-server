const nodemailer = require("nodemailer");
const orderConfirmationTemplate = require("../templates/orderConfirmation");
const orderAdminTemplate = require("../templates/orderAdmin");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

async function sendOrderConfirmationEmail(order) {
    try {
        await transporter.sendMail({
            from: `"BEDOIN" <${process.env.GMAIL_USER}>`,
            to: order.email,
            subject: `Дякуємо за замовлення #${order.orderId} — BEDOIN`,
            html: orderConfirmationTemplate(order),
        });
        console.log(`Email клієнту надіслано: ${order.email}`);
    } catch (error) {
        console.error("Помилка при відправці email клієнту:", error.message);
    }
}

async function sendOrderAdminEmail(order) {
    try {
        await transporter.sendMail({
            from: `"BEDOIN" <${process.env.GMAIL_USER}>`,
            to: "coffeebedouin@gmail.com",
            subject: `🛒 Нове замовлення #${order.orderId} — ${order.total} грн`,
            html: orderAdminTemplate(order),
        });
        console.log(`Email адміну надіслано: замовлення #${order.orderId}`);
    } catch (error) {
        console.error("Помилка при відправці email адміну:", error.message);
    }
}

module.exports = { sendOrderConfirmationEmail, sendOrderAdminEmail };
