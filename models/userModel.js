const bcrypt = require("bcrypt");
const {sqlConnection} = require("../config/db");
const jwt = require("jsonwebtoken");
const {
    emailCheck,
    passwordCheck,
    pseudoCheck
} = require('../utils/validations/validations');

exports.userRegister = async (userData) => {
    const { email, pseudo, password } = userData;

    emailCheck(email);
    pseudoCheck(pseudo);
    passwordCheck(password);

    const hashedPassword = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
        const checkEmailAndPseudoQuery = 'SELECT * FROM user WHERE email = ? OR pseudo = ?';
        
        sqlConnection.query(checkEmailAndPseudoQuery, [email, pseudo], (err, result) => {
            if (err) return reject(err);

            if (result.length > 0) {
                const existingUser = result[0];
                if (existingUser.email === email) {
                    return reject(new Error('Email already exists'));
                }
                if (existingUser.pseudo === pseudo) {
                    return reject(new Error('Pseudo already exists'));
                }
            }

            const insertUserQuery = `INSERT INTO user (email, pseudo, password, created_at) VALUES (?, ?, ?, NOW())`;
            sqlConnection.query(insertUserQuery, [email, pseudo, hashedPassword], (err, result) => {
                if (err) return reject(err);
                resolve({ id: result.insertId, pseudo, email });
            });
        });
    });
};

exports.userLogin = async ({emailOrPseudo, password}) => {
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isEmailOrPseudo = '';

    return new Promise((resolve, reject) => {
        if (emailCheck.test(emailOrPseudo)) {
            isEmailOrPseudo = 'email';
        } else {
            isEmailOrPseudo = 'pseudo';
        }

        const query = `SELECT * FROM user WHERE ${isEmailOrPseudo} = ?`;

        sqlConnection.query(query, [emailOrPseudo], async (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.length === 0) {
                return reject(new Error('User doesn\'t exist'));
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch){
                return reject(new Error('Invalid credentials'));
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            resolve({id: user.id, token});
        });
    });
};

exports.getUserById = (id) => {
    const query = `SELECT id, email, pseudo FROM user WHERE id = ?`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(query, [id], (err, result) => {
            if (err){
                return reject(err);
            }

            if (result.length === 0){
                return resolve(null);
            }

            resolve(result[0]);
        })
    })
};

exports.getAllUsers = () => {
    const query = `SELECT * FROM user`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(query, (err, result) => {
            if (err){
                return reject(err);
            }

            if (result.length === 0){
                return resolve(null);
            }

            resolve(result);
        })
    });
};

exports.updateUserById = async (id, newData) => {
    const { email, pseudo, password, modified_at } = newData;

    // Vérifications similaires à l'inscription de l'utilisateur
    emailCheck(email);
    pseudoCheck(pseudo);

    // Si un nouveau mot de passe est fourni, vérifier qu'il est différent de l'ancien
    if (password) {
        const query = `SELECT * FROM user WHERE id=?`;
        const user = await new Promise((resolve, reject) => {
            sqlConnection.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result[0]);
            });
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            throw new Error("Le nouveau mot de passe ne peut pas être identique à l'ancien.");
        }
        // Hasher le nouveau mot de passe
        newData.password = await bcrypt.hash(password, 10);
    }

    // Mettre à jour les informations de l'utilisateur dans la base de données
    const queryUpdate = `UPDATE user SET email=?, pseudo=?, password=?, modified_at=? WHERE id=?`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(queryUpdate, [email, pseudo, newData.password, modified_at, id], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.affectedRows === 0) {
                return resolve(null); // Aucune ligne affectée, donc aucun utilisateur trouvé avec cet ID
            }

            // Récupérer les informations de l'utilisateur mis à jour
            const querySelect = `SELECT * FROM user WHERE id=?`;
            sqlConnection.query(querySelect, [id], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                const updatedUser = rows[0];
                resolve(updatedUser);
            });
        });
    });
};

exports.deleteUserById = async (id) => {
    // Supprimer l'utilisateur de la base de données
    const queryDelete = `DELETE FROM user WHERE id=?`;

    return new Promise((resolve, reject) => {
        sqlConnection.query(queryDelete, [id], (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.affectedRows === 0) {
                return resolve(null); // Aucune ligne affectée, donc aucun utilisateur trouvé avec cet ID
            }

            resolve({ message: 'Utilisateur supprimé avec succès' });
        });
    });
};