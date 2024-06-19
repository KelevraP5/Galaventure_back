const mongoose = require("mongoose");

const mongoConnect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log('MongoDB Connection error: ', err));
};

module.exports = mongoConnect;