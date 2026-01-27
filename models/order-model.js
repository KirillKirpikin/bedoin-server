const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        orderId: { type: String, required: true },
        orderTime: { type: Date, default: Date.now },
        paymentStatus: { type: String, default: "pending" },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        city: { type: String, required: false },
        info: { type: String, required: false },
        promo: { type: String, required: false },
        warehouses: { type: String, required: false },
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
        delivery: { type: String, required: true },
        payment: { type: String, required: true },
        call: { type: String, required: true },
    },
    {
        collection: "orders",
    },
);

module.exports = model("Order", OrderSchema);
