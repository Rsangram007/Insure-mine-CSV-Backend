const { Schema, model } = require("mongoose");
const User = require("./User-Model");
const Agent = require("./Agent-Model");
const PolicyCarrier = require("./Policy-Carrier-Model");
const PolicyCategory = require("./Policy-Category-Model");
const UsersAccount = require("./Users-Account-Model");

// Policy Info schema
const policyInfoSchema = new Schema(
    {
        policy_number: { type: String, required: true },
        policy_type: { type: String, required: true },
        producer: { type: String },
        csr: { type: String },
        premium_amount: { type: String, required: true },
        policy_start_date: { type: String, required: true },
        policy_end_date: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        agentId: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
        carrierId: { type: Schema.Types.ObjectId, ref: "PolicyCarrier", required: true },
        categoryId: { type: Schema.Types.ObjectId, ref: "PolicyCategory", required: true },
        accountNameId: { type: Schema.Types.ObjectId, ref: "UsersAccount", required: true }
    },
    { timestamps: true }
);

const PolicyInfo = model('PolicyInfo', policyInfoSchema);
module.exports = PolicyInfo;
