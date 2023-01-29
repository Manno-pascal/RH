const mongoose = require('mongoose')

const compagnySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    siret: {
        type: Number,
        required: [true, 'Pas de numéro siret'],
    },
    mail: {
        type: String,
        required: [true, 'Pas de mail'],
    },
    password: {
        type: String,
        required: [true, 'Pas de mot de passe']
    },
    CEOName: {
        type: String,
        required: [true, 'Pas de nom du directeur']
    },
    workers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workers"
        }],
    },

})

const CompagnyModel = mongoose.model('Compagnies', compagnySchema);

module.exports = CompagnyModel