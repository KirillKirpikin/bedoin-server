const {Schema, model} = require('mongoose');

const SliderSchema = new Schema({
    title: {type: String, required: true},
    coffeeId: {type:String, required: true},
    imgs:[{type: String, required: true}]
},{
    collection: 'slider'
})

module.exports = model('Slider', SliderSchema);