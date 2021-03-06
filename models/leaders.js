const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var leaderSchema = new Schema ({
    name : {
      type:String,
      required:true,
      unique: true
    },
    image:{
      type:String,
      required: true
    },
    description:{
      type:String,
      required:true
    },
    abbr:{
      type:String,
      required:true,
    },
    featured:{
      type:Boolean,
      default:false
    },
    time : { type : Date, default: Date.now }
  });

  var Leaders = mongoose.model('Leader',leaderSchema);

  module.exports = Leaders;