const mongoose = require("mongoose");
const ExpressError = require("../utilities/ExpressError");


const postSchema = new mongoose.Schema({
    text: [{
        type: String,
    }],
    image: {
        url: { type: String },
        filename: { type: String },

    },
    author: {
        type: "ObjectId",
        ref: "User"
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);


