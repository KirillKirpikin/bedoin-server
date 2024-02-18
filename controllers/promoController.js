const PromoModel = require('../models/promo-model');
const ApiError = require('../error/ApiErrir');

class PromoController {
    async create(req, res, next){
        try {
            const {name, product, procent} = req.body;
            const promo = new PromoModel({
                name, product, procent
            })
            await promo.save();
            return res.json({message: `Промо ${promo.name} додано`});            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async checkPromo(req, res, next){
        try {
            const {promo} = req.body;
            const item = await PromoModel.findOne({name: promo});
            if(!item) {
                return  res.status(404).json({ message: 'Промокод не дійсний' });
            }
            return res.json(item)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const promo = await PromoModel.find();
            return res.json(promo)            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} =req.params;
            const promo = await PromoModel.findById(id);
            if (!promo) {
                return res.status(404).json({ message: 'Промо не знайдено' });
            }
    
            const deletePromo = await PromoModel.findByIdAndDelete(id);
            return res.json({ message: `Промо ${deletePromo.name} успішно видалено` })
            
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    
    }


}

module.exports = new PromoController;