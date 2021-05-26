const express = require('express');
const bodyParser = require('body-parser');

const courseRouter = express.Router();

courseRouter.use(bodyParser.json());

courseRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the courses to you!');
})
.post((req, res, next) => {
    res.end('Will add the course: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /courses');
})
.delete((req, res, next) => {
    res.end('Deleting all courses');
});

courseRouter.route('/:courseId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the course: ' + req.params.courseId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/'+ req.params.courseId);
})
.put((req, res, next) => {
    res.write('Updating the course: ' + req.params.courseId + '\n');
    res.end('Will update the course: ' + req.body.name +  ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting course: ' + req.params.courseId);
});

module.exports = courseRouter;