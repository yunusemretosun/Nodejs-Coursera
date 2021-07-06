const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
const leaderRouter = express.Router();
var authenticate = require('../authenticate');
const Leaders = require('../models/leaders');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  Leaders.create((req.body))
  .then((leader) => {
      console.log('Leader Created ', leader);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
  }),(err)=>(next(err))
  .catch((err) => next(err)); 
})
.put(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders');
})
.delete(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
      Leaders.remove({}).then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
      }),(err)=>(next(err))
      .catch((err) => next(err)); 
});
//index.js ten gelen yolun sonuna bakar eger id varsa bu calisir.
leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req, res, next) => {
  Leaders.findById(req.params.leaderId)
  .then((leader) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  res.statusCode = 403;
  res.end(`POST operation not supported for /leaders/${req.params.leaderId}`);
})
.put(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  Leaders.findByIdAndUpdate(req.params.leaderId,{
    $set:req.body
  },
  { new:true  })
  .then((leader)=>{
    res.statusCode(200);
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then((leader) => {
    res.statusCode(200);
    res.setHeader('Content-Type','application/json');
    res.json(leader);
  }, (err) => next(err))
    .catch((err) => next(err));
});
//Comments
leaderRouter.route('/:leaderId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
  Leaders.findById(req.params.leaderId)
  .then((leader)=>{
    if(leader != null){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(leader.comments);
    }
    else{
      err  = new Error("Leader"+req.params.leaderId+"Not Found");
      err.statusCode = 404;
      return next(err);
    }
}, (err) => next(err))
  .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req,res,next)=>{
  Leaders.findById(req.params.leaderId)
  .then((leader)=>{
    if(leader != null){
      leader.comments.push(req.body);
      leader.save().then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
      },(err) => next(err));
    }
    else {
      err = new Error('leader ' + req.params.leaderId + ' not found');
      err.status = 404;
      return next(err);
  }
}, (err) => next(err))
.catch((err) => next(err));
  })
.put(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req,res,next)=>{
  res.statusCode = 403;
  res.end('PUT operation not supported on /leaders/'
      + req.params.leaderId + '/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
  Leaders.findById(req.params.leaderId)
  .then((leader) => {
      if (leader != null) {
          for (var i = (leader.comments.length -1); i >= 0; i--) {
              leader.comments.id(leader.comments[i]._id).remove();
          }
          leader.save()
          .then((leader) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(leader);                
          }, (err) => next(err));
      }
      else {
          err = new Error('leader ' + req.params.leaderId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});
//comment with :commentId
leaderRouter.route('/:leaderId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader.comments.id(req.params.commentId));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                leader.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                leader.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyOrdinaryUser,(req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        if (leader != null && leader.comments.id(req.params.commentId) != null) {
          leader.comments.id(req.params.commentId).remove();
          leader.save()
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);                
            }, (err) => next(err));
        }
        else if (leader == null) {
            err = new Error('leader ' + req.params.leaderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;