const router = require('express').Router()
const auth = require('../middleware/auth')
const noteCtrl = require('../controllers/noteCtrl')

router.route('/')
    .get(auth, noteCtrl.getNotes)
    .post(auth, noteCtrl.createNote)

router.route('/:id')
    .get(auth, noteCtrl.getNote)
    .put(auth, noteCtrl.updateNote)
    .delete(auth, noteCtrl.deleteNote)

// router.route('/')
//     .get(noteCtrl.getNotes)
//     .post(noteCtrl.createNote)

// router.route('/:id')
//     .get(noteCtrl.getNote)
//     .put(noteCtrl.updateNote)
//     .delete(noteCtrl.deleteNote)

module.exports = router