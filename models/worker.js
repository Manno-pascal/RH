const mongoose = require('mongoose')

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    picture: {
        type: String,
        required: [true, 'Pas de photo'],
    },
    position: {
        type: String,
        required: [true, 'Pas de poste'],
    },
    warningNumber: {
        type: Number,
        required: [true, 'Pas de blâme']
    },
    compagnyId: {
        type: String,
        required: [true, "Pas d'id"]
    },

})

const WorkerModel = mongoose.model('Workers', workerSchema);

module.exports = WorkerModel