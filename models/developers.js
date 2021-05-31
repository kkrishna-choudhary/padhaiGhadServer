const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const developerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false      
    }
},{
    timestamps: true
});

var Developers = mongoose.model('Developer', developerSchema);

module.exports = Developers;