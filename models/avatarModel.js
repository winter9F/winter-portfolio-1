const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    image: {
        url: { type: String },
        filename: { type: String },

    },
    author: {
        type: "ObjectId",
        ref: "User"
    },
});

module.exports = mongoose.model("Avatar", avatarSchema);


