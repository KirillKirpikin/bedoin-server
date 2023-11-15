const path = require('path');
const LemonadeModel = require('../models/lemonade-model');
const ApiError = require('../error/ApiErrir');

const { deleteStaticPhoto, parseImg, parseInfo, checkAndUpdateImg} = require('../utils/handlingData');

class LemonadeController{
    async create(req, res, next){
        try {
            let {title, short_description, in_stock, description} = req.body;
            let {img} = req.files;
            let arrImg = parseImg(img);          
            let price = req.body.price;
            if(price){
                price = JSON.parse(price)
            }            
            let info = req.body.info;
            let infoArr = parseInfo(info);          

            const newLemonade = new LemonadeModel({
                title,
                description,
                imgs: arrImg,
                short_description,
                in_stock,
                price: price,
                info: infoArr,
            }) 

            const saveLemonade = await newLemonade.save();
            return res.json({message: `${saveLemonade.title}, успешно добавлен `})
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async updateOne(req, res, next){
        try {
            const {id} = req.params;
            let {title, short_description,in_stock, oldImgs, description} = req.body;
            let fil = req.files;
            const product = await LemonadeModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            let arrImg = checkAndUpdateImg(oldImgs, product, fil);
            let price = req.body.price;
            if(price){               
                price = JSON.parse(price)
            }
            let info = req.body.info;         
            let infoArr = parseInfo(info);
            const updateData = {
                title,
                description,
                imgs: arrImg,
                short_description,
                in_stock,
                price: price,
                info: infoArr,
            }

            const updateLemonade = await LemonadeModel.findByIdAndUpdate(id, updateData, {new: true});

            if (!updateLemonade) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            return res.json({message: 'Успншно обновлено'});            
        } catch (e) {
            return res.json({ message: 'Ошибка', e });
        }
    }
    async getAll(req, res, next){
        try {
            const products = await LemonadeModel.find();
            return res.json(products)            
        } catch (e) {
            next(ApiError.badRequest(e.message));           
        }
    }
    async getInStock(req, res, next){
        try {
            const product = await LemonadeModel.find({in_stock: true});
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params;
            const product = await LemonadeModel.findById(id)
            return res.json(product);            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} =req.params;
            const product = await LemonadeModel.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            product.imgs.forEach(item=>{
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            })          
            let deleteProduct =  await LemonadeModel.findByIdAndDelete(id);
            
            return res.json({ message: `Запись ${deleteProduct.title} успешно удалена` });
            
        } catch (e) {
            console.log(e);
            return res.json({ message: 'Ошибка', e });
        }
    }

}

module.exports = new LemonadeController;