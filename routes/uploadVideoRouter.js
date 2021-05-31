const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/videos');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const videoFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(mp4|avi|webm|mpg)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: videoFileFilter});

const uploadVideoRouter = express.Router();

uploadVideoRouter.use(bodyParser.json());

uploadVideoRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /videoUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('videoFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /videoUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /videoUpload');
});

module.exports = uploadVideoRouter;