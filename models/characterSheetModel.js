const { sqlConnection } = require('../config/db');

exports.createSheet = (userData) => {
    const { nom, race, classe, sante, mana, stat_1, stat_2, stat_3, stat_4, competences, inventaire, isPNJ } = userData;

    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO fiche_personnage (nom, race, classe, sante, mana, stat_1, stat_2, stat_3, stat_4, competences, inventaire, isPNJ, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';

        const competencesJSON = JSON.stringify(competences);
        const inventaireJSON = JSON.stringify(inventaire);

        sqlConnection.query(query, [nom, race, classe, sante, mana, stat_1, stat_2, stat_3, stat_4, competencesJSON, inventaireJSON, isPNJ], (err, result) => {
            if (err) return reject(err);

            resolve({ id: result.insertId, nom, race, classe, sante, mana, stat_1, stat_2, stat_3, stat_4, competences, inventaire, isPNJ, created_at: new Date() });
        });
    });
};

exports.getOneSheet = (id) => {
    const query = `SELECT id, nom, race, classe, sante, mana, stat_1, stat_2, stat_3, stat_4, competences, inventaire, isPNJ FROM fiche_personnage WHERE id = ?`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(query, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.length === 0) {
                return resolve(null);
            }

            const sheet = result[0];
            sheet.competences = JSON.parse(sheet.competences);
            sheet.inventaire = JSON.parse(sheet.inventaire);

            resolve(sheet);
        });
    });
};

exports.deleteCharacterSheetById = async (id) => {
    const queryDelete = `DELETE FROM fiche_personnage WHERE id=?`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(queryDelete, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.affectedRows === 0) {
                return resolve(null);
            }

            resolve({ message: 'Fiche de personnage supprimé avec succès' });
        });
    });
};
