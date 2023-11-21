const path = require('path');
const DripModel = require('../models/drip-model');
const ApiError = require('../error/ApiErrir');

const {deleteStaticPhoto, checkAndUpdateImg, parseInfo, parseImg} = require('../utils/handlingData');

class DripController {
    async create(req, res, next){
        try {
            let {title, short_description, description,in_stock} = req.body;
            let {img} = req.files;

            let arrImg = parseImg(img);     
            let price = req.body.price;
            if(price){
                price = JSON.parse(price)
            }
            let info = req.body.info;
            let infoArr = parseInfo(info);

            const newDrip = new DripModel({
                title,
                short_description,
                description,
                imgs: arrImg,
                in_stock,
                price: price,
                info: infoArr
            })

            const saveProduct = await newDrip.save();
            return res.json({message: `${saveProduct.title}, успешно добавлен `})
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }

    }
    async updateOne(req, res, next){
        try {
            const {id} = req.params;
            let {title, short_description, description,in_stock, oldImgs} = req.body;
            let fil = req.files;
            const product = await DripModel.findById(id);
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
                short_description,
                description,
                imgs: arrImg,
                in_stock,
                price: price,
                info: infoArr
            }


            const updatedDrip = await DripModel.findByIdAndUpdate(id, updateData, {new: true});
            if(!updatedDrip) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }

            return res.json({message: `${updateData.title}, Успншно обновлено`});
        } catch (error) {
            console.log('ERROR ERROR' ,error);
            return res.json({ message: 'Ошибка', error });
        }
        
    }
    async getAll(req, res, next){
        try {
            const products = await DripModel.find();
            return res.json(products)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getInStock(req, res, next){
        try{
            const product = await DripModel.find({in_stock: true});
            return res.json(product)
        }catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next){
        try {
            const {id} = req.params;
            const product = await DripModel.findById(id)
            return res.json(product);
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} =req.params;
            const product = await DripModel.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }

            product.imgs.forEach(item=>{
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            })

            deleteProduct =  await DripModel.findByIdAndDelete(id);
            return res.json({ message: `Запись ${deleteProduct.title} успешно удалена` });
            
        } catch (error) {
            return res.json({ message: 'Ошибка', error });
        }
    }

}

module.exports = new DripController;