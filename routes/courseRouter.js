const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Courses = require('../models/courses');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
.get((req,res,next) => {
    Courses.find({})
    .then((courses) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(courses);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Courses.create(req.body)
    .then((course) => {
        console.log('Course Created ', course);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courses');
})
.delete((req, res, next) => {
    Courses.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

courseRouter.route('/:courseId')
.get((req,res,next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/'+ req.params.courseId);
})
.put((req, res, next) => {
    Courses.findByIdAndUpdate(req.params.courseId, {
        $set: req.body
    }, { new: true })
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Courses.findByIdAndRemove(req.params.courseId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


courseRouter.route('/:courseId/courseItem')
.get((req,res,next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.courseItem);
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            course.courseItem.push(req.body);
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courses/'
        + req.params.courseId + '/courseItem');
})
.delete((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            for (var i = (course.courseItem.length -1); i >= 0; i--) {
                course.courseItem.id(course.courseItem[i]._id).remove();
            }
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

courseRouter.route('/:courseId/courseItem/:courseItemId')
.get((req,res,next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.courseItem.id(req.params.courseItemId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.courseItem.id(req.params.courseItemId));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('CourseItem ' + req.params.courseItemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/'+ req.params.courseId
        + '/courseItem/' + req.params.courseItemId);
})
.put((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.courseItem.id(req.params.courseItemId) != null) {
            if (req.body.title) {
                course.courseItem.id(req.params.courseItemId).title = req.body.title;
            }
            if (req.body.video) {
                course.couseItem.id(req.params.courseItemId).video = req.body.video;                
            }
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('CourseItem ' + req.params.courseItemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.courseItem.id(req.params.courseItemId) != null) {
            course.courseItem.id(req.params.courseItemId).remove();
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('CourseItem ' + req.params.courseItemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = courseRouter;