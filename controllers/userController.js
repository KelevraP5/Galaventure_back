const userModel = require("../models/userModel");

exports.userRegister = async (req, res) => {
    try{
        const user = await userModel.userRegister(req.body);
        res.status(201).json(user);
    } catch(err){
        res.status(400).json({message: err.message});
    }
}

exports.userLogin = async (req, res) => {
    try{
        const result = await userModel.userLogin(req.body);
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try{
        const user = await userModel.getUserById(userId);

        if (!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);

    } catch (err){
        return res.status(500).json({message: err.message});
    }
};



