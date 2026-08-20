const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
    {
        firstName: { type: String, required: true },
        // Необов'язково для доставки "Courier" (кур'єр по місту) і "Pickup" (самовивіз)
        lastName: { type: String, required: false },
        orderId: { type: String, required: true },
        orderTime: { type: Date, default: Date.now },
        paymentStatus: { type: String, default: "pending" },
        phone: { type: String, required: true },
        // Необов'язково для доставки "Courier" (кур'єр по місту) і "Pickup" (самовивіз)
        email: { type: String, required: false },
        city: { type: String, required: false },
        info: { type: String, required: false },
        promo: { type: String, required: false },
        warehouses: { type: String, required: false },
        street: { type: String, required: false },
        house: { type: String, required: false },
        courierAddress: { type: String, required: false },
        novaPostType: { type: String, required: false },
        isConversion: { type: Boolean, required: false, default: false },
        order: [
            {
                _id: { type: String, required: true },
                title: { type: String, required: true },
                packing: { type: Number, required: true },
                quantity: { type: Number, required: true },
                select: { type: String, required: true },
                price: { type: Number, required: true },
            },
        ],
        total: { type: Number, required: true },
        deliveryCost: { type: Number, required: false, default: 0 },
        deliveryCostIncluded: { type: Boolean, required: false, default: false },
        delivery: { type: String, required: true },
        payment: { type: String, required: true },
        call: { type: String, required: true },
    },
    {
        collection: "orders",
    },
);

module.exports = model("Order", OrderSchema);
