const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leaderes to you!');
})
.post((req,res,next) => {
    res.end('Adding the leader: ' + req.body.name + ', with details: ' + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operator not suported on /leaders')
})
.delete((req,res,next) => {
    res.end('Will deleting all the leaders');
});

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send the leader: ' + req.params.leaderId + ' to you!');
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end('POST operator not suported on /leaders/' + req.params.leaderId)
})
.put((req,res,next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ', with details: ' + req.body.description)
})
.delete((req,res,next) => {
    res.end('Will deleting the leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;