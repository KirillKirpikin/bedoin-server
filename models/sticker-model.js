const {Schema, model} = require('mongoose');

const StickerSchema = new Schema({
    img:{type:String, required:true},
    label:{ type: String, required: true },
},{
    collection:'sticker'
})

module.exports = model('Sticker', StickerSchema);