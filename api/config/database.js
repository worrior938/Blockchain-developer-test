const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () => {
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log("Mongoose Connected");
        })
        .catch((error) => {
            console.log("MongoDB connection error:", error.message);
        });
}

module.exports = connectDatabase;