const {Schema, model} = require('mongoose');

const LemonadeSchema = new Schema({
    title:{type:String, required:true},
    imgs:[{type: String, required: true}],
    description:{type: String, required: true},
    short_description:{type: String, required: true},
    in_stock:{type:Boolean, required:true},
    price:{
        standart:{
            regular:{type: String, required: true},
            opt: {type: String, required: true}
        }
    },
    info: [{
        name:String,
        text:String
    }]
},{
    collection: 'lemonade'
})

module.exports = model('Lemonade', LemonadeSchema);