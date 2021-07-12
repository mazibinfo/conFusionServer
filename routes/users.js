var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const passport = require('passport');
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
  res.sendStatus = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({Success: true, Status: 'You are successfully loged in!'});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
