const {Schema, model} = require('mongoose');

const PromoSchema = new Schema({
    name: {type: String, unique: true, required: true},
    product: {type: String, required: true},
    procent: {type: String, required: true},
},{
    collection: 'promo'
})

module.exports = model('Promo', PromoSchema);