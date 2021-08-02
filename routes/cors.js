const express = require('express');
const cors = require('cors');
const app = express();

var whiteList = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 'http://localhost:3001'];
var corsOptionsDelegate = (req, callback) => {
    console.log(req.header('origin'));
    var corsOptions;
    if(whiteList.indexOf(req.header('origin')) !== -1) {
        corsOptions = { origin : true };
    }
    else {
        corsOptions = { origin : false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);