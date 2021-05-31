const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const enrolledCourseSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
},{
    timestamps: true
});

var EnrolledCourses = mongoose.model('EnrolledCourse', enrolledCourseSchema);

module.exports = EnrolledCourses;