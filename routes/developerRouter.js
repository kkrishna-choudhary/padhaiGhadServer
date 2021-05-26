const express = require('express');
const bodyParser = require('body-parser');

const developerRouter = express.Router();

developerRouter.use(bodyParser.json());

developerRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the developers details to you!');
})
.post((req, res, next) => {
    res.end('Will add the developer: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /developers');
})
.delete((req, res, next) => {
    res.end('Deleting all developers');
});

developerRouter.route('/:developerId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send details of the developer: ' + req.params.developerId +' to you!');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /developers/'+ req.params.developerId);
})
.put((req, res, next) => {
    res.write('Updating the developer: ' + req.params.developerId + '\n');
    res.end('Will update the developer: ' + req.body.name +  ' with details: ' + req.body.description);
})
.delete((req, res, next) => {
    res.end('Deleting developer: ' + req.params.developerId);
});

module.exports = developerRouter;