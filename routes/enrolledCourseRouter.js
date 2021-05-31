const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');


var authenticate = require('../authenticate');
const cors = require('./cors');
const EnrolledCourses = require('../models/enrolledCourse');

const enrolledCourseRouter = express.Router();

enrolledCourseRouter.use(bodyParser.json());

enrolledCourseRouter.route('/')
.options(cors.corsWithOptions,  (req, res) => { res.sendStatus(200); })
.get(cors.cors,  authenticate.verifyUser, (req,res,next) => {

    EnrolledCourses.findOne({user: req.user._id})
    .populate('user')
    .populate('courses')
    .then((enrolledCourses) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(enrolledCourses);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    EnrolledCourses.findOne({user: req.user._id})
    .then((enrolledCourse) => {
        if (enrolledCourse) {
            for (var i=0; i<req.body.length; i++) {
                if (enrolledCourse.courses.indexOf(req.body[i]._id) === -1) {
                    enrolledCourse.courses.push(req.body[i]._id);
                }
            }
            enrolledCourse.save()
            .then((enrolledCourse) => {
                EnrolledCourses.findById(enrolledCourse._id)
                .populate('user')
                .populate('courses')
                .then((enrolledCourse) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(enrolledCourse);
                }, (err) => next(err));
            })
            .catch((err) => {
                return next(err);
            });
            // .then((favorite) => {
            //     console.log('Favorite Created ', favorite);
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type', 'application/json');
            //     res.json(favorite);
            // }, (err) => next(err)); 
        }
        else {
            EnrolledCourses.create({"user": req.user._id, "courses": req.body})
            .then((enrolledCourse) => {
                EnrolledCourses.findById(enrolledCourse._id)
                    .populate('user')
                    .populate('courses')
                    .then((enrolledCourse) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(enrolledCourse);
                    }, (err) => next(err));
            })
            .catch((err) => {
                return next(err);
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /enrolledCourses');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    EnrolledCourses.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

enrolledCourseRouter.route('/:courseId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    EnrolledCourses.findOne({user: req.user._id})
    .then((enrolledCourses) => {
        if (!enrolledCourses) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "enrolledCourses": enrolledCourses});
        }
        else {
            if (enrolledCourses.courses.indexOf(req.params.courseId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "enrolledCourses": enrolledCourses});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "enrolledCourses": enrolledCourses});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    EnrolledCourses.findOne({user: req.user._id})
    .then((enrolledCourse) => {
        if (enrolledCourse) {            
            if (enrolledCourse.courses.indexOf(req.params.courseId) === -1) {
                enrolledCourse.courses.push(req.params.courseId)
                enrolledCourse.save()
                .then((enrolledCourse) => {
                    EnrolledCourses.findById(enrolledCourse._id)
                    .populate('user')
                    .populate('courses')
                    .then((enrolledCourse) => {
                        console.log('EnrolledCourses Course Created ', enrolledCourse);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(enrolledCourse);
                    }, (err) => next(err));

                })
                .catch((err) => {
                    return next(err);
                });
            }
        }
        else {
            EnrolledCourses.create({"user": req.user._id, "courses": [req.params.courseId]})
            .then((enrolledcourse) => {

                EnrolledCourses.findById(enrolledcourse._id)
                    .populate('user')
                    .populate('courses')
                    .then((enrolledCourse) => {
                        console.log('enrolledCourse Course Created ', enrolledCourse);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(enrolledCourse);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /enrolledCourses/'+ req.params.courseId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    EnrolledCourses.findOne({user: req.user._id})
    .then((enrolledCourse) => {
        if (enrolledCourse) {            
            index = enrolledCourse.courses.indexOf(req.params.courseId);
            if (index >= 0) {
                enrolledCourse.courses.splice(index, 1);
                enrolledCourse.save()
                .then((enrolledCourse) => {
                    EnrolledCourses.findById(enrolledCourse._id)
                    .populate('user')
                    .populate('courses')
                    .then((enrolledCourse) => {
                        console.log('EnrolledCourse Course Deleted ', enrolledCourse);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(enrolledCourse);
                    }, (err) => next(err));
                    
                }, (err) => next(err))
                .catch((err) => {
                    return next(err);
                });
            }
            else {
                err = new Error('Course with id' + req.params.courseId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('EnrolledCourses not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = enrolledCourseRouter;


