const characterSheetModel = require('../models/characterSheetModel');
const { postSheet } = require('../models/evoCharacterModel');

exports.postCharacterSheet = async (req, res) => {
    const sheetId = req.params.id;
    const newData = req.body;

    try {
        // Récupérer la fiche de personnage de MySQL
        const sheet = await characterSheetModel.getOneSheet(sheetId);
        if (!sheet) {
            console.log(`Character sheet not found in MySQL for ID: ${sheetId}`);
            return res.status(404).json({ message: 'Character sheet not found in MySQL' });
        }

        // Ajoutez des logs pour vérifier les nouvelles données
        console.log('New data to update:', newData);

        // Mettre à jour MongoDB avec les nouvelles données
        const updatedSheet = await postSheet(sheetId, newData);

        console.log('Updated character sheet:', updatedSheet);

        res.status(200).json(updatedSheet); // Répondre avec la fiche de personnage mise à jour
    } catch (err) {
        console.error('Error in postCharacterSheet controller:', err);
        res.status(500).json({ message: err.message });
    }
};
