const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const CourseItems = require('../models/courseItems');

const courseItemRouter = express.Router();

courseItemRouter.use(bodyParser.json());

courseItemRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    CourseItems.find(req.query)
    .populate('teacher')
    .then((courseItems) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(courseItems);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.body != null) {
        req.body.teacher = req.user._id;
        CourseItems.create(req.body)
        .then((courseItem) => {
            CourseItems.findById(courseItem._id)
            .populate('teacher')
            .then((courseItem) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(courseItem);
            },(err)=>next(err));
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('CourseItem not found in request body');
        err.status = 404;
        return next(err);
    }

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courseItems/');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    CourseItems.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

courseItemRouter.route('/:courseItemId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    CourseItems.findById(req.params.courseItemId)
    .populate('teacher')
    .then((courseItem) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(courseItem);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courseItems/'+ req.params.courseItemId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    CourseItems.findById(req.params.courseItemId)
    .then((courseItem) => {
        if (courseItem != null) {
            if (!courseItem.teacher.equals(req.user._id)) {
                var err = new Error('You are not authorized to update this courseItem!');
                err.status = 403;
                return next(err);
            }
            req.body.teacher = req.user._id;
            CourseItems.findByIdAndUpdate(req.params.courseItemId, {
                $set: req.body
            }, { new: true })
            .then((courseItem) => {
                CourseItems.findById(courseItem._id)
                .populate('author')
                .then((courseItem) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(courseItem); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error('CourseItem ' + req.params.courseItemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    CourseItems.findById(req.params.courseItemId)
    .then((courseItem) => {
        if (courseItem != null) {
            if (!courseItem.teacher.equals(req.user._id)) {
                var err = new Error('You are not authorized to delete this courseItem!');
                err.status = 403;
                return next(err);
            }
            CourseItems.findByIdAndRemove(req.params.courseItemId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            err = new Error('CourseItem ' + req.params.courseItemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = courseItemRouter;