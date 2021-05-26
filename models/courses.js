const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

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
    }
}, {
    timestamps: true
});


const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    courseDuration: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    fee: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    teacher:  {
        type: String,
        required: true
    },
    courseItem:[courseItemSchema]
}, {
    timestamps: true
});

var Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;