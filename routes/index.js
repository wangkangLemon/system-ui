var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'this is ui index' });
});

/* ping for heartbeat */
router.get('ping', function (re, res) {
    res.send('PONG');
})

module.exports = router;
