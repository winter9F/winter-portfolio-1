const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    image: [{
        url: { type: String },
        filename: { type: String },

    }]
});

module.exports = mongoose.model("Post", postSchema);


