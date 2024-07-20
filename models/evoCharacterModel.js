const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const evoCharacterSchema = new Schema({
    id_fiche_personnage: { type: Number, required: true },
    sante: { type: Number, required: true },
    mana: { type: Number, required: true },
    competences: { type: [String], required: true },
    inventaire: { type: [String], required: true },
    modified_at: { type: Date, default: Date.now }
});

const CharacterEvolution = mongoose.model('CharacterEvolution', evoCharacterSchema, 'evolution_personnage');

const postSheet = async (id, newData) => {
    try {
        newData.modified_at = new Date();
        newData.id_fiche_personnage = id;

        const updatedSheet = await CharacterEvolution.findOneAndUpdate(
            { id_fiche_personnage: id },
            newData,
            { new: true, upsert: true }
        );

        if (!updatedSheet) {
            throw new Error('Character sheet not found');
        }

        return updatedSheet;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    CharacterEvolution,
    postSheet
};
