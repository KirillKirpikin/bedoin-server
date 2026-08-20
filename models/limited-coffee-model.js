const { Schema, model } = require("mongoose");

const LimitedCoffeeSchema = new Schema(
    {
        title: { type: String, required: true },
        short_description: { type: String, required: true },
        country: { type: String, required: true },
        description: { type: String, required: true },
        weight_grams: { type: Number, required: true },
        id_standart: { type: String, required: false },
        imgs: [{ type: String, required: true }],
        in_stock: { type: Boolean, required: true },
        crossSell: [
            {
                model: {
                    type: String,
                    enum: ["Coffee", "Drip", "Lemonade", "Merch", "LimitedCoffee"],
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
            regular: { type: String, required: true },
        },
        type: [
            {
                label: String,
                img: String,
            },
        ],
        roast_type: {
            type: String,
            enum: ["Espresso", "Filter"],
            default: "Filter",
            required: true,
        },
        coffee_type: {
            type: String,
            enum: ["Premium", "Specialty", "Blend", "Micro lot"],
            default: "Specialty",
            required: true,
        },
        badge: {
            type: String,
            enum: ["New crop", "Bestseller"],
            required: false,
        },
        info: [
            {
                name: String,
                text: String,
            },
        ],
        recipe: [
            {
                name: String,
                info: [
                    {
                        name: String,
                        text: String,
                    },
                ],
            },
        ],
    },
    {
        collection: "limited_coffees",
    },
);

module.exports = model("LimitedCoffee", LimitedCoffeeSchema);
