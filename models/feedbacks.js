const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const feedbackSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    telnum: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactType:{
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        default:false      
    },
    message:{
        type: String,
        required: true
    },
},{
    timestamps: true
});

var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;