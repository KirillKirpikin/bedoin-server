const { Schema, model } = require("mongoose");

const LemonadeSchema = new Schema(
    {
        title: { type: String, required: true },
        imgs: [{ type: String, required: true }],
        description: { type: String, required: true },
        short_description: { type: String, required: true },
        id_standart: { type: String, required: false },
        in_stock: { type: Boolean, required: true },
        crossSell: [
            {
                model: {
                    type: String,
                    enum: ["Coffee", "Drip", "Lemonade", "Merch"],
                    required: true,
                },
                item: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: "crossSell.model",
                },
            },
        ],
        price: {
            standart: {
                regular: { type: String, required: true },
                opt: { type: String, required: true },
            },
        },
        info: [
            {
                name: String,
                text: String,
            },
        ],
    },
    {
        collection: "lemonade",
    },
);

module.exports = model("Lemonade", LemonadeSchema);
