var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req,res,next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.sendStatus = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err : err});
    }
    else {
      passport.authenticate('local') (req,res, () => {
      res.sendStatus = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({Success: true, Status: 'Registration Successfull!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req,res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.sendStatus = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({Success: true, Token: token, Status: 'You are successfully loged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    // var err = new Error('You are not logged in!');
    // err.status = 403;
    // return next(err);
    res.statusCode = 200;
    res.setHeader('Conten-Type', 'plain/text');
    res.end('Logout Successfully!');
  }
});

module.exports = router;
