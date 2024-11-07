const { Schema, model } = require("mongoose");

// User schema
const userSchema = new Schema(
    {
        firstname: { type: String, required: true },
        dob: { type: String, required: true },
        address: { type: String },
        phone: { type: String, required: true },
        state: { type: String },
        zip: { type: String },
        email: { type: String, required: true },
        gender: { type: String, },
        userType: { type: String, }
    },
    { timestamps: true }
);

const User = model('User', userSchema);
module.exports = User;
