const mongoose = require('mongoose')


const pomoSchema = new mongoose.Schema({
    pomoLeft:{
        type: Number,
        required: true
    },
    focusDuration:{
        type: Number,
        default: 25
    },
    breakDuration:{
        type: Number,
        default: 5
    },
    note_id: {
        type: String,
        required: true
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


module.exports = mongoose.model('Pomos', pomoSchema)