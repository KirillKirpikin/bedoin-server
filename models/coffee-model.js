const {Schema, model} = require('mongoose');

const CoffeeSchema = new Schema({
    title: {type: String, required: true},
    short_description:{type: String, required: true},
    country:{type: String, required: true},
    imgs:[{type: String, required: true}],
    imgs_kg:[{type: String, required: false}],
    packing_kg:{type:Boolean, required:true},
    in_stock:{type:Boolean, required:true},
    price:{
        standart:{
            regular:{type: String, required: true},
            opt: {type: String, required: true}
        },
        kg:{
            regular:{type: String, required: true},
            opt: {type: String, required: true}
        }
    },
    type:[{
        label:String,
        img:String
    }],
    description:{type: String, required: true},
    info: [{
        name:String,
        text:String
    }]
},{
    collection: 'coffees'
})


module.exports = model('Coffee', CoffeeSchema);