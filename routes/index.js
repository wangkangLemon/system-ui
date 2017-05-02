var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'this is ui index' });
});

// 所有的视图页面
router.get('/view/*', function(req, res, next){
  res.set('Content-Type', 'text/plain');
  res.sendFile('../public/index.html');
})

/* ping for heartbeat */
router.get('ping', function (re, res) {
    res.send('PONG');
})

module.exports = router;
