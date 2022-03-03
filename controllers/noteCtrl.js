const Notes = require('../models/noteModel')
const Pomos = require('../models/pomoModel')

const noteCtrl = {
    getNotes: async (req, res) =>{
        try {
            const notes = await Notes.find({user_id: req.user.id})
            res.json(notes)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createNote: async(req, res) =>{
        try {
            const {title, content, date, pdfLink, pageCount, pomoLeft} = req.body.note;
            const newNote = new Notes({
                title,
                content,
                date,
                pdfLink,
                pageCount,
                pomoLeft,
                user_id: req.user.id,
                name: req.user.name
            })
            await newNote.save()

            const {pomoCount, focusDuration, breakDuration} = req.body.pomo;
            const newPomo = new Pomos({
                pomoCount,
                focusDuration,
                breakDuration,
                note_id: newNote.id,
                user_id: req.user.id,
                name: req.user.name
            })
            await newPomo.save()
            res.json({newNote, newPomo})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteNote: async(req, res) =>{
        try {
            await Notes.findByIdAndDelete(req.params.id)
            await Pomos.findOneAndDelete({note_id: req.params.id})
            res.json({msg: "Deleted a Note"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateNote: async(req, res) =>{
        try {
            const {title, content, date} = req.body.note;
            await Notes.findByIdAndUpdate(req.params.id,{
                title,
                content,
                date,
            })
            
            const {pomoCount} = req.body.pomo;
            await Pomos.findOneAndUpdate({note_id: req.params.id}, {
                pomoCount
            })
            
            res.json({msg: "Updated a Note"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNote: async(req, res) => {
        try {
            const note = await Notes.findById(req.params.id)
            const pomo = await Pomos.findOne({note_id: note.id})
            res.json({note, pomo})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = noteCtrl