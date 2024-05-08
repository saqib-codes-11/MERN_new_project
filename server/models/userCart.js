const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserCart = new Schema({

        // product:[{
        //     productId:String
        // }]
        product:[String]

});
module.exports = mongoose.model('UserCart',UserCart);