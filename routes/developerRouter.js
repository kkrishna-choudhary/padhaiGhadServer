const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Developers = require('../models/developers');

var authenticate = require('../authenticate');
const cors = require('./cors');

const developerRouter = express.Router();

developerRouter.use(bodyParser.json());

developerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Developers.find(req.query)
    .then((developers) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(developers);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Developers.create(req.body)
    .then((developer) => {
        console.log('Developer Created ', developer);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(developer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /developers');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Developers.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

developerRouter.route('/:developerId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    Developers.findById(req.params.developerId)
    .then((developer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(developer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /developers/'+ req.params.developerId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Developers.findByIdAndUpdate(req.params.developerId, {
        $set: req.body
    }, { new: true })
    .then((developer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(developer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Developers.findByIdAndRemove(req.params.developerId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = developerRouter;