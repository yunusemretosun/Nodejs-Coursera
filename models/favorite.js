const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dishes'
    }]
},{
    timestamps: true
  });

var Favorites = mongoose.model('Favorites',favoriteSchema);
module.exports = Favorites;