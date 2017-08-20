var express = require('express');
var router = express.Router();
var path = require('path');

// 1.引入mysql模块
var mysql = require('mysql');
// 2.设置mysql连接参数
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'flame',
    database : 'sp2web'
  });

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
      connection.query({
        sql: 'SELECT ID,NAME,CTIME FROM `torlists` WHERE `NAME` like "%' + key + '%" order by `CTIME` desc limit ' + 20 * (page - 1) + ',20 ',
        timeout: 40000, // 40s
      }, function (error, results, fields) {
        if (error) {
          console.log(error);
        } else {
          res.send({
            success: true,
            dt: results,
            count: results.length
          });
        }
      });
    }else{
      connection.query({
        sql: 'SELECT ID,NAME,CTIME FROM `torlists` order by `CTIME` desc limit ' + 20 * (page - 1) + ',20 ',
        timeout: 40000, // 40s
      }, function (error, results, fields) {
        if (error) {
          console.log(error);
        } else {
          res.send({
            success: true,
            dt: results,
            count: results.length
          });
        }
      });
    }
  });

  app.get('/down/:torname', function(req, res, next) {
    // console.log(req.params.torname);
    var filename = req.params.torname;
    res.download('/data/sp2der/tts/' + filename,filename + '.torrent');
  });
};
