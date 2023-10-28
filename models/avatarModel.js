const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
    image: {
        url: { type: String },
        filename: { type: String },

    }
});

module.exports = mongoose.model("Avatar", avatarSchema);


