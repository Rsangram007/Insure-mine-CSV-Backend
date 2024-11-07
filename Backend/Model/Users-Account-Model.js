const { Schema, model } = require("mongoose");

// Users Account Schema
const usersAccountSchema = new Schema(
    { account_name: { type: String, required: true } },
    { timestamps: true }
);

const UsersAccount = model('UsersAccount', usersAccountSchema);
module.exports = UsersAccount;
