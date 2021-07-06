const mongoose = require('mongoose');

require('mongoose-currency').loadType(mongoose);
var Currency  = mongoose.Types.Currency;

var promoSchema = new mongoose.Schema({
  name : {
    type:String,
    required:true,
    unique:true
  },
  image:{
    type:String,
    required:true
  },
  label: {
    type:String,
    default:''
  },
  price:{
    type:Currency,
    required:true,
    min:0
  },
  description:{
    type:String,
    required:true
  },
  featured:{
    type:Boolean,
    default:false
  },
  time : { type : Date, default: Date.now }
})

var Promotions = mongoose.model('Promotion',promoSchema);
module.exports = Promotions;