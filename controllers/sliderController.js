const path = require('path');
const SliderModel = require('../models/slider-model');
const { parseImg, deleteStaticPhoto } = require('../utils/handlingData');
const ApiError = require('../error/ApiErrir');

class SliderController {
    async create(req, res, next){
        try {
            let {title, coffeeId} = req.body;
            let {img} = req.files;            
            let arrImg = parseImg(img);
            const newSlide = new SliderModel({
                title,
                coffeeId,
                imgs: arrImg
            });
            const saveSlide = await newSlide.save();
            return res.json({message: `${saveSlide.title}, успешно добавлен слайд`})        
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
        
    }

    async getAll(req, res, next){
        try {
            const slide = await SliderModel.find();
            return res.json(slide)      
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            const slide = await SliderModel.findById(id);
            if (!slide) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            slide.imgs.forEach(item=>{
                deleteStaticPhoto(path.join(__dirname, '..', 'static', item));
            })
            dieleteSlide = await SliderModel.findByIdAndDelete(id);
            return res.json({ message: `Слайд ${deleteProduct.title} успешно удалена` });
        } catch (e) {
            return res.json({ message: 'Ошибка', e});
        }

    }
}

module.exports = new SliderController;
