const SubscribeModel = require('../models/subscription-model');
const ApiError = require('../error/ApiErrir');

class SubscribeController {
    async create(req, res){
        try {
            const {email, sent} = req.body;
            const pretend = await SubscribeModel.findOne({email});
            if(pretend){
                return res.status(400).json({message: 'Ви вже підписані на розсилку, дякую'})
            }
            const subscriber = new SubscribeModel({
                email,
                sent
            })
            await subscriber.save()
            return res.json({message: 'Дякуємо за підписку'})
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next){
        try {
            const item = await SubscribeModel.find().sort({sentTime:-1});
            return res.json(item)            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async updateOne(req, res, next){
        try {
            const {id} = req.params;
            let {email, sent} = req.body;
            const item = await SubscribeModel.findById(id);
            if (!item) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            const updateData = {
                email,
                sent
            }
    
            const updateItem = await SubscribeModel.findByIdAndUpdate(id, updateData,{new: true});
            if(!updateItem){
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            return res.json({message: 'Успншно обновлено'});            
        } catch (e) {
            return res.json({ message: 'Ошибка', e});
        }
    }
    async deleteOne(req, res, next){
        try {
            const {id} = req.params;
            const item = await SubscribeModel.findById(id);
            if (!item) {
                return res.status(404).json({ message: 'Запись не найдена' });
            }
            deleteItem =  await SubscribeModel.findByIdAndDelete(id);
            return res.json({ message: 'Запись успешно удалена'});
            
        } catch (error) {
            return res.json({ message: 'Ошибка', error });
        }
    }

}

module.exports = new SubscribeController;