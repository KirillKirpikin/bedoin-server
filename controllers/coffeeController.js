const uuid = require("uuid");
const path = require("path");
const CoffeeModel = require("../models/coffee-model");
const ApiError = require("../error/ApiErrir");

const { saveImg, deleteStaticPhoto } = require("../utils/handlingData");

class CoffeeController {
    async create(req, res, next) {
        try {
            let {
                title,
                short_description,
                country,
                description,
                in_stock,
                packing_kg,
                id_kg,
                id_standart,
            } = req.body;
            let { img, img_kg } = req.files;
            let arr = [];

            if (Array.isArray(img)) {
                img.forEach((img) => {
                    arr.push(saveImg(img));
                });
            } else {
                arr.push(saveImg(img));
            }

            let arrKg = [];
            if (img_kg) {
                if (Array.isArray(img_kg)) {
                    img_kg.forEach((img) => {
                        arrKg.push(saveImg(img));
                    });
                } else {
                    arrKg.push(saveImg(img_kg));
                }
            }
            let crossSell = req.body.crossSell;
            if (crossSell) {
                crossSell = JSON.parse(crossSell);
            } else {
                crossSell = [];
            }

            let price = req.body.price;
            if (price) {
                price = JSON.parse(price);
            }

            let type = req.body.type;
            let arrType = [];
            if (type) {
                type = JSON.parse(type);
                type.forEach((i) => {
                    arrType.push({
                        label: i.label,
                        img: i.img,
                    });
                });
            }

            let info = req.body.info;
            let infoArr = [];
            if (info) {
                info = JSON.parse(info);
                info.forEach((i) => {
                    infoArr.push({
                        name: i.name,
                        text: i.text,
                    });
                });
            }

            let recipe = req.body.recipe;
            let recipeArr = [];
            if (recipe) {
                recipe = JSON.parse(recipe);
                recipe.forEach((i) => {
                    let infoArr = [];
                    i.info.forEach((j) => {
                        infoArr.push({
                            name: j.name,
                            text: j.text,
                        });
                    });
                    recipeArr.push({
                        name: i.name,
                        info: infoArr,
                    });
                });
            }

            const newProduct = new CoffeeModel({
                title,
                short_description,
                country,
                imgs: arr,
                imgs_kg: arrKg,
                packing_kg,
                in_stock,
                id_kg: id_kg,
                id_standart: id_standart,
                price: price,
                type: arrType,
                description,
                info: infoArr,
                recipe: recipeArr,
                crossSell,
            });

            const saveProduct = await newProduct.save();
            return res.json(saveProduct);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateOne(req, res, next) {
        console.log("upd");
        try {
            const { id } = req.params;
            let {
                title,
                short_description,
                country,
                description,
                in_stock,
                packing_kg,
                id_kg,
                id_standart,
                oldImgs,
                oldImgsKg,
            } = req.body;
            let fil = req.files;
            const product = await CoffeeModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Запись не найдена" });
            }

            let arr = [];

            const oldImgArray = JSON.parse(oldImgs);
            const removedImages = product.imgs.filter(
                (img) => !oldImgArray.includes(img)
            );
            if (removedImages.length > 0) {
                removedImages.forEach((item) => {
                    deleteStaticPhoto(
                        path.join(__dirname, "..", "static", item)
                    );
                });
            }
            arr = [...oldImgArray];

            if (fil !== null && fil.img) {
                if (Array.isArray(fil.img)) {
                    img.forEach((img) => {
                        arr.push(saveImg(img));
                    });
                } else {
                    arr.push(saveImg(fil.img));
                }
            }

            let crossSellParsed = [];

            try {
                const raw = req.body.crossSell; // строка из FormData
                if (typeof raw === "string" && raw.trim()) {
                    crossSellParsed = JSON.parse(raw);
                } else {
                    crossSellParsed = [];
                }
            } catch (e) {
                console.log("Bad crossSell JSON:", req.body.crossSell);
                crossSellParsed = [];
            }

            let arrKg = [];

            const oldoldImgArrayKg = JSON.parse(oldImgsKg);
            const removedImagesKg = product.imgs_kg.filter(
                (img) => !oldoldImgArrayKg.includes(img)
            );
            if (removedImagesKg > 0) {
                removedImages.forEach((item) => {
                    deleteStaticPhoto(
                        path.join(__dirname, "..", "static", item)
                    );
                });
            }

            arrKg = [...oldoldImgArrayKg];

            if (fil !== null && fil.img_kg) {
                if (Array.isArray(fil.img_kg)) {
                    img.forEach((img) => {
                        arrKg.push(saveImg(img));
                    });
                } else {
                    arrKg.push(saveImg(fil.img_kg));
                }
            }

            let price = req.body.price;
            if (price) {
                price = JSON.parse(price);
            }

            let type = req.body.type;
            let arrType = [];
            if (type) {
                type = JSON.parse(type);
                type.forEach((i) => {
                    arrType.push({
                        label: i.label,
                        img: i.img,
                    });
                });
            }

            let info = req.body.info;

            let infoArr = [];
            if (info) {
                info = JSON.parse(info);
                info.forEach((i) => {
                    infoArr.push({
                        name: i.name,
                        text: i.text,
                    });
                });
            }

            let recipe = req.body.recipe;

            let recipeArr = [];
            if (recipe) {
                recipe = JSON.parse(recipe);
                recipe.forEach((i) => {
                    let infoArr = [];
                    i.info.forEach((j) => {
                        infoArr.push({
                            name: j.name,
                            text: j.text,
                        });
                    });
                    recipeArr.push({
                        name: i.name,
                        info: infoArr,
                    });
                });
            }

            const updateData = {
                title,
                short_description,
                country,
                imgs: arr,
                imgs_kg: arrKg,
                packing_kg,
                in_stock,
                price: price,
                id_kg: id_kg,
                id_standart: id_standart,
                type: arrType,
                description,
                info: infoArr,
                recipe: recipeArr,
                crossSell: crossSellParsed,
            };

            const updatedProduct = await CoffeeModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Запись не найдена" });
            }

            return res.json({ message: "Успншно обновлено" });
        } catch (error) {
            console.log(error);
            return res.json({ message: "Ошибка", error });
        }
    }

    async getAll(req, res, next) {
        try {
            // Создаём объект фильтра
            const filter = {};

            // Поиск по названию (частичное совпадение, регистронезависимый)
            if (req.query.search) {
                filter.title = { $regex: req.query.search, $options: "i" };
            }

            // Фильтр по типу обжарки (під фільтр / під еспресо)
            if (req.query.roastType) {
                filter["info"] = {
                    $elemMatch: {
                        name: {
                            $regex: "^\\s*Тип обсмажки\\s*$",
                            $options: "i",
                        },
                        text: {
                            $regex: `^\\s*${req.query.roastType.trim()}\\s*$`,
                            $options: "i",
                        },
                    },
                };
            }

            if (req.query.in_stock === "true") {
                filter.in_stock = true;
            }

            const products = await CoffeeModel.find(filter).sort({
                in_stock: -1,
            });

            // Временное логирование для отладки
            if (req.query.roastType && products.length > 0) {
                console.log(
                    "Первый найденный продукт info:",
                    JSON.stringify(products[0].info, null, 2)
                );
            } else if (req.query.roastType && products.length === 0) {
                // Получим один продукт без фильтра, чтобы посмотреть структуру
                const sampleProduct = await CoffeeModel.findOne();
                console.log(
                    "Пример info из БД:",
                    JSON.stringify(sampleProduct?.info, null, 2)
                );
            }

            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllFeed() {
        try {
            const products = await CoffeeModel.find();
            return products;
        } catch (e) {
            console.error(e);
            throw new Error("Error fetching in-stock products");
        }
    }

    async getInStock(req, res, next) {
        try {
            const product = await CoffeeModel.find({ in_stock: true });
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await CoffeeModel.findById(id);
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const { id } = req.params;
            const product = await CoffeeModel.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Запись не найдена" });
            }
            product.imgs.forEach((item) => {
                deleteStaticPhoto(path.join(__dirname, "..", "static", item));
            });
            let deleteProduct = await CoffeeModel.findByIdAndDelete(id);

            return res.json({ message: "Запись успешно удалена" });
        } catch (error) {
            return res.json({ message: "Ошибка", error });
        }
    }
}

module.exports = new CoffeeController();
