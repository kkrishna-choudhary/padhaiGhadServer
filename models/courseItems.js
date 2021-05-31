const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var courseItemSchema = new Schema({
    video: {
        type: String,
        required: true
    },
    duration:  {
        type: String,
        required: true
    },
    title:  {
        type: String,
        required: true
    },
    teacher:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
}, {
    timestamps: true
});


var CourseItems = mongoose.model('CourseItem', courseItemSchema);

module.exports = CourseItems;