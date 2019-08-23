var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Magnet = require('./magnet')

const promise = mongoose.connect('mongodb://127.0.0.1:27017/test',{useMongoClient:true})
mongoose.Promise = global.Promise

module.exports = function(app){
  /* GET home page. */
  app.get('/', function(req, res) {
    res.render('index',{title:'welcome'});
  });

  app.get('/search', function(req, res, next) {
    var key = req.query.name;
    var page = !req.query.page ? 1:req.query.page;

    // console.log(page);
    if(key){
      let query = new RegExp(key,'i')
      Magnet.find({
        $or:[
          {name:{$regex:query}}
        ]
      })
      .skip(20*(page-1))
      .limit(20)
      .sort({'_id':-1})
      .exec(function(error,results){
        if(error){
          res.send({
            success: false,
            dt: error.message,
            count: 0
          });
        } else {
          res.send({
            success: true,
            dt: results,
            count: results.length
          });
        }
      })
      

    }else{
      Magnet.find()
      .skip(20*(page-1))
      .limit(20)
      .sort({'_id':-1})
      .exec(function(error,results){
        // console.log(results)
        if(error){
          res.send({
            success: false,
            dt: error.message,
            count: 0
          });
        } else {
          res.send({
            success: true,
            dt: results,
            count: results.length
          });
        }
      })
    }
  });

  app.get('/down/:torname', function(req, res, next) {
    // console.log(req.params.torname);
    // var filename = req.params.torname;
    // res.download('/data/sp2der/tts/' + filename,filename + '.torrent');
  });
};
