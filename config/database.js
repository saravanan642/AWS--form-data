const mongoose = require("mongoose");

const Database = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongoose is connected successfully");

    } catch (err) {
        console.log(err.message);
        console.log("MongoDB connection failed");
    }
};

module.exports = Database;