const path = require('path');
const MerchModel = require('../models/merch-model');
const ApiError = require('../error/ApiErrir');

const { deleteStaticPhoto, parseImg, parseInfo, checkAndUpdateImg} = require('../utils/handlingData');

class MerchController {
    async create(req, res, next){
        try {
            let {title, short_description,in_stock} = req.body;
            let {img} = req.files;

            let arrImg = parseImg(img);          
            let price = req.body.price;
            if(price){
                price = JSON.parse(price)
            }
            let sizes = req.body.size;
            let arrSizes = ['none'];
            if(sizes){
                arrSizes = sizes.split(',')
            }
            
            let info = req.body.info;
            let infoArr = parseInfo(info);          

            const newMerch = new MerchModel({
                title,
                // description,
                imgs: arrImg,
                short_description,
                in_stock,
                price: price,
                info: infoArr,
                size: arrSizes
            }) 

            const saveMerch = await newMerch.save();
            return res.json({message: `${saveMerch.title}, успешно добавлен `})
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async updateOne(req, res, next){
        try {
            const {id} = req.params;
            let {title, short_description,in_stock, oldImgs} = req.body;
            let fil = req.files;
            const product = await MerchModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            let arrImg = checkAndUpdateImg(oldImgs, product, fil);
            let price = req.body.price;
            if(price){               
                price = JSON.parse(price)
            }
            let sizes = req.body.size;
            let arrSizes = ['none'];
            if(sizes){
                arrSizes = sizes.split(',')
            }

            let info = req.body.info;         
            let infoArr = parseInfo(info);

            const updateData = {
                title,
                // description,
                imgs: arrImg,
                short_description,
                in_stock,
                price: price,
                info: infoArr,
                size: arrSizes
            }

            const updateMerch = await MerchModel.findByIdAndUpdate(id, updateData, {new: true});

            if (!updateMerch) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            return res.json({message: 'Успншно обновлено'});
        } catch (e) {
            console.log('ERROR ERROR' ,e);
            return res.json({ message: 'Ошибка', e });
        }
    }
    async getAll(req, res, next){
        try {
            const products = await MerchModel.find();
            return res.json(products)            
        } catch (e) {
            next(ApiError.badRequest(e.message));           
        }
    }
    async getInStock(req, res, next){
        try {
            const product = await MerchModel.find({in_stock: true});
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params;
            const product = await MerchModel.findById(id)
            return res.json(product);            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} =req.params;
            const product = await MerchModel.findById(id);

            if (!product) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            product.imgs.forEach(item=>{
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            })          
            let deleteProduct =  await MerchModel.findByIdAndDelete(id);
            
            return res.json({ message: `Запись ${deleteProduct.title} успешно удалена` });
            
        } catch (e) {
            console.log(e);
            return res.json({ message: 'Ошибка', e });
        }
    }
}

module.exports = new MerchController;