const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000','https://localhost:3443'];

var corsOptionDelegate = (req,callback)=>{
    var corsOptions;
    console.log(req.header('Origin'));
    //indexOf ile birlikte verilen deger eger yoksa -1 doner
    //origin false demek bu request icin corsu devre disi birak demek.
    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = {origin: false};
    }
    else{
        corsOptions = {origin:true};
    }
    callback(null,corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);
