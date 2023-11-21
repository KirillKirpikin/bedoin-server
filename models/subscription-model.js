const {Schema, model} = require('mongoose');

const SubscribeSchema = new Schema({
    email:{type: String, unique: true, required: true},
    sent:{type:Boolean, required: true},
    sentTime:{type: Date, default: Date.now}
},{
    collection: 'subscribe'
})

module.exports = model('Subscribe', SubscribeSchema)