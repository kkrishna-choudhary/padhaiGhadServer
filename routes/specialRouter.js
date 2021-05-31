const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Specials = require('../models/specials');

var authenticate = require('../authenticate');
const cors = require('./cors');

const specialRouter = express.Router();

specialRouter.use(bodyParser.json());

specialRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Specials.find(req.query)
    .then((specials) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(specials);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Specials.create(req.body)
    .then((special) => {
        console.log('Special Created ', special);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /specials');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Specials.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

specialRouter.route('/:specialId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Specials.findById(req.params.specialId)
    .then((special) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /specials/'+ req.params.specialId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Specials.findByIdAndUpdate(req.params.specialId, {
        $set: req.body
    }, { new: true })
    .then((special) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(special);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Specials.findByIdAndRemove(req.params.specialId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = specialRouter;