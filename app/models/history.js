var mongoose = require('mongoose');

module.exports = mongoose.model('History', {
    text: {
        type: String,
        default: ''
    },
    number:{
        type: Number,
        default:''
    },
    created: {
        type: Date,
        default: ''
    }
});