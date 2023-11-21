const path = require('path');
const uuid = require('uuid');
const StickerModel = require('../models/sticker-model');
const { deleteStaticPhoto } = require('../utils/handlingData');
const ApiError = require('../error/ApiErrir');

class StickerController {
    async create(req, res, next){
        try {
            let {label} = req.body;
            let {img} = req.files;
            let fileName = uuid.v4() + ".svg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const newSticker = new StickerModel({
                img: fileName,
                label
            });
            const saveSticker = await newSticker.save();
            return res.json({message:`${saveSticker.label}, успешно добавлен стикер`})
                        
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next){
        try {
            const stick = await StickerModel.find();
            return res.json(stick)      
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            const stick = await StickerModel.findById(id);
            if (!stick) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }            
            deleteStaticPhoto(path.join(__dirname, '..', 'static', stick.img));            
            dieleteStick = await StickerModel.findByIdAndDelete(id);
            return res.json({ message: `Стикер успешно удалена` });
        } catch (e) {
            return res.json({ message: 'Ошибка', e});
        }
    }
}

module.exports = new StickerController;