const mongoose = require('mongoose')


const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        default: ''
    },
    date:{
        type: Date,
        default: Date.now
    },
    pdfLink: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        default: 0
    },
    pomoCount: {
        type: Number,
        default: 5
    },
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
},{
    timestamps: true
})


module.exports = mongoose.model('Notes', noteSchema)