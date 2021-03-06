var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  },(err) => next(err))
  .catch((err) => next(err))
});

router.post('/signup', cors.corsWithOptions, (req,res,next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err : err});
    }
    else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err : err});
          return;
        }
        passport.authenticate('local') (req,res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({Success: true, Status: 'Registration Successful!'});
        })
      });
    }
  });
});

router.post('/login', cors.corsWithOptions, (req,res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success : false, status : "Login Unsuccesful!", err : info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success : false, status : "Login Unsuccessful!", err : "Could not login user!"})
      }
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Succesful!', token: token});
    })
  }) (req, res);
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({Success: true, Token: token, Status: 'You are successfully loged in!'});
});

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: "JWT invalid", err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({succes: true, status: "JWT valid", user: user})
    }
  }) (req, res);
});

module.exports = router;
