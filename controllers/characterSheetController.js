const sheetModel = require('../models/characterSheetModel');

exports.createSheet = async (req, res) => {
    try {
        const sheet = await sheetModel.createSheet(req.body);
        res.status(201).json(sheet);
    } catch (err) {
        res.status(401).json(err);
    }
};

exports.getOneSheet = async (req, res) => {
    const sheetId = req.params.id;

    try {
        const sheet = await sheetModel.getOneSheet(sheetId);

        if (!sheet) {
            return res.status(404).json({ message: 'Sheet not found' });
        }

        res.status(200).json(sheet);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


