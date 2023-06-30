
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        username: { type: "String", required: true },
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        pic: {
            type: "String",
            required: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        phone: {
            type: "String",
            required: true
        },
    },
    { timestaps: true }
);


const User = mongoose.model("User", userSchema);

module.exports = User;