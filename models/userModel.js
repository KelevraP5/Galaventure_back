const bcrypt = require("bcrypt");
const {sqlConnection} = require("../config/db");
const jwt = require("jsonwebtoken");

exports.userRegister = async (userData) => {
    const { email, pseudo, password } = userData;
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pseudoCheck = /^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/|`~-]+$/;
    const onlyDigitsCheck = /^\d+$/;

    if (!emailCheck.test(email)) {
        throw new Error("Invalid email format");
    }

    if (onlyDigitsCheck.test(pseudo)) {
        throw new Error("Pseudo cannot be composed only of digits");
    }

    if (!pseudoCheck.test(pseudo)) {
        throw new Error("Pseudo must contain at least one letter");
    }

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


