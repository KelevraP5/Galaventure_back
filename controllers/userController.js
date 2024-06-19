const userModel = require("../models/userModel");

exports.userRegister = async (req, res) => {
    try{
        const user = await userModel.userRegister(req.body);
        res.status(201).json(user);
    } catch(err){
        res.status(400).json({message: err.message});
    }
}

