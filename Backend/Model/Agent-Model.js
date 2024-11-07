const { Schema, model } = require("mongoose");


const agentSchema = new Schema({ agent: { type: String, required: true } }, 
    { timestamps: true });

const Agent = model('Agent', agentSchema);
module.exports = Agent;
