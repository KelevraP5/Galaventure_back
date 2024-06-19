const bcrypt = require("bcrypt");
const {sqlConnection} = require("../config/db");

exports.userRegister = async (userData) => {
    const { email, pseudo, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO user (email, pseudo, password, created_at) VALUES (?, ?, ?, NOW())`;
    return new Promise((resolve, reject) => {
        sqlConnection.query(query, [email, pseudo, hashedPassword], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve({id: result.insertId, email, pseudo});
        });
    });
};

