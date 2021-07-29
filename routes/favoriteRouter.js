const express = require('express');
const bodyParser = require('body-parser');
const favouriteRouter = express.Router();
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
        else {
            err = new Error('You have no Favorites!');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (var i = 0; i < req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((userFav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFav);
            }, (err) => next(err))
        }
        else {
            Favorites.create({user : req.user._id, dishes : req.body})
            .then((userFav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFav);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operator is not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({user : req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err))
});

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('COntent-Type', 'application/json');
            res.json({"exits" : false, "favorites" : favorites})
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('COntent-Type', 'application/json');
                res.json({"exits" : false, "favorites" : favorites})               
            }
            else {
                res.statusCode = 200;
                res.setHeader('COntent-Type', 'application/json');
                res.json({"exits" : true, "favorites" : favorites})
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then((favorite) => {
        if (favorite) {
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorite.dishes.push(req.params.dishId);
            }
            favorite.save()
            .then((userFav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFav);
            }, (err) => next(err))
        }
        else {
            Favorites.create({user : req.user._id, dishes : req.params.dishId})
            .then((userFav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFav);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operator is not supporte on /favorite/' + req.params.dishId)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user : req.user._id})
    .then((favorite) => {
        if (favorite) {
            index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                .then((userFav) => {
                    if (userFav.dishes.length) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(userFav);
                    }
                    else {
                        Favorites.findOneAndRemove({user : req.user._id})
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                    }
                }, (err) => next(err))
            }
            else {
                err = new Error('Dish: ' + req.params.dishId + ' not found!');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('You have no favorites!');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = favouriteRouter;