var express = require('express');
var router = express.Router();
var path = require('path');

// 1.引入mongoose模块
var mongoose = require('mongoose');
// 2.设置mongoose的promise，连接服务器
mongoose.Promise = global.Promise;
var db = mongoose.connect('mongodb://admin:flame@127.0.0.1:27017/sp2web',{useMongoClient: true});
// 3.创建模型
var listModel = mongoose.model('torlist',
      {
        name:String,
        file:String,
        memo:JSON,
        ctime:Date
      }
    );

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
      var result = listModel.find({"name": {$regex: key, $options:'i'}},function(err,data){
        if(err){
          console.log(err);
        }else{
          // console.log(data);
          res.send({
            success:true,
            dt:data,
            count:data.length
          });
        }
      }).limit(20).skip(20*(page - 1)).sort({ctime: 'desc' });
    }else{
      var result = listModel.find(function(err,data){
        if(err){
          console.log(err);
        }else{
          // console.log(data);
          res.send({
            success:true,
            dt:data,
            count:data.length
          });
        }
      }).limit(20).skip(20*(page - 1)).sort({ctime: 'desc' });
    }
  });

  app.get('/down/:torname', function(req, res, next) {
    // console.log(req.params.torname);
    var filename = req.params.torname;
    res.download('../../sp2der/tts/' + filename,filename + '.torrent');
  });
};
