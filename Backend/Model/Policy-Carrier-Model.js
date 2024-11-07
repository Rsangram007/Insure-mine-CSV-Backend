const { Schema, model } = require("mongoose");


const policyCarrierSchema = new Schema(
    { company_name: { type: String, required: true } },
    { timestamps: true }
);

const PolicyCarrier = model('PolicyCarrier', policyCarrierSchema);
module.exports = PolicyCarrier;
