const path = require("path");
const LimitedCoffeeModel = require("../models/limited-coffee-model");
const ApiError = require("../error/ApiErrir");

const {
    deleteStaticPhoto,
    parseImg,
    parseInfo,
    checkAndUpdateImg,
} = require("../utils/handlingData");

class LimitedCoffeeController {
    async create(req, res, next) {
        try {
            let {
                title,
                short_description,
                country,
                description,
                weight_grams,
                in_stock,
                id_standart,
                roast_type,
                coffee_type,
                badge,
            } = req.body;
            let { img } = req.files;

            let arrImg = parseImg(img);

            let price = req.body.price;
            if (price) {
                price = JSON.parse(price);
            }

            let info = req.body.info;
            let infoArr = parseInfo(info);

            let recipe = req.body.recipe;
            let recipeArr = [];
            if (recipe) {
                recipe = JSON.parse(recipe);
                recipe.forEach((i) => {
                    let recipeInfoArr = [];
                    i.info.forEach((j) => {
                        recipeInfoArr.push({
                            name: j.name,
                            text: j.text,
                        });
                    });
                    recipeArr.push({
                        name: i.name,
                        info: recipeInfoArr,
                    });
                });
            }

            let crossSell = req.body.crossSell;
            if (crossSell) {
                crossSell = JSON.parse(crossSell);
            } else {
                crossSell = [];
            }

            const newProduct = new LimitedCoffeeModel({
                title,
                short_description,
                country,
                description,
                weight_grams,
                imgs: arrImg,
                in_stock,
                id_standart,
                price,
                roast_type,
                coffee_type,
                badge: badge ? badge : undefined,
                info: infoArr,
                recipe: recipeArr,
                crossSell,
            });

            const saveProduct = await newProduct.save();
            return res.json({
                message: `${saveProduct.title}, успішно додано`,
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateOne(req, res, next) {
        try {
            const { id } = req.params;
            let {
                title,
                short_description,
                country,
                description,
                weight_grams,
                in_stock,
                id_standart,
                oldImgs,
                roast_type,
                coffee_type,
                badge,
            } = req.body;
            let fil = req.files;
            const product = await LimitedCoffeeModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Запись не найдена" });
            }

            let arrImg = checkAndUpdateImg(oldImgs, product, fil);

            let price = req.body.price;
            if (price) {
                price = JSON.parse(price);
            }

            let info = req.body.info;
            let infoArr = parseInfo(info);

            let recipe = req.body.recipe;
            let recipeArr = [];
            if (recipe) {
                recipe = JSON.parse(recipe);
                recipe.forEach((i) => {
                    let recipeInfoArr = [];
                    i.info.forEach((j) => {
                        recipeInfoArr.push({
                            name: j.name,
                            text: j.text,
                        });
                    });
                    recipeArr.push({
                        name: i.name,
                        info: recipeInfoArr,
                    });
                });
            }

            let crossSellParsed = [];
            try {
                const raw = req.body.crossSell;
                if (typeof raw === "string" && raw.trim()) {
                    crossSellParsed = JSON.parse(raw);
                }
            } catch (e) {
                crossSellParsed = [];
            }

            const updateData = {
                title,
                short_description,
                country,
                description,
                weight_grams,
                imgs: arrImg,
                in_stock,
                id_standart,
                price,
                roast_type,
                coffee_type,
                info: infoArr,
                recipe: recipeArr,
                crossSell: crossSellParsed,
            };

            const updateQuery = badge
                ? { $set: { ...updateData, badge } }
                : { $set: updateData, $unset: { badge: "" } };

            const updatedProduct = await LimitedCoffeeModel.findByIdAndUpdate(
                id,
                updateQuery,
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Запись не найдена" });
            }

            return res.json({ message: "Успішно оновлено" });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const products = await LimitedCoffeeModel.find().sort({
                in_stock: -1,
            });
            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getInStock(req, res, next) {
        try {
            const products = await LimitedCoffeeModel.find({
                in_stock: true,
            }).sort({ in_stock: -1 });
            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await LimitedCoffeeModel.findById(id);
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await LimitedCoffeeModel.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Запись не найдена" });
            }
            product.imgs.forEach((item) => {
                deleteStaticPhoto(path.join(__dirname, "..", "static", item));
            });
            const deleteProduct = await LimitedCoffeeModel.findByIdAndDelete(id);

            return res.json({
                message: `Запис ${deleteProduct.title} успішно видалено`,
            });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new LimitedCoffeeController();
