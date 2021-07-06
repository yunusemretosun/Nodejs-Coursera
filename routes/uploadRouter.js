const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const imageFileFilter = (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('you can upload only images'),false);
    }
    cb(null,true); //bu callback fonk dosyanin resim oldugunu dogrular.
};

const upload = multer({
    storage:storage , 
    fileFilter:imageFileFilter,
});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.get(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,
(req,res,next)=>{
    res.statusCode = 403;
    res.end('GET OPERATION not supported');
})
.post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,
upload.single('imageFile'),(req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,
(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT OPERATION not supported');
})
.delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,
(req,res,next)=>{
    res.statusCode = 403;
    res.end('DELETE OPERATION not supported'); 
})

module.exports = uploadRouter;
