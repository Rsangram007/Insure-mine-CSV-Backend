const { Schema, model } = require("mongoose");

// Policy Category Schema
const policyCategorySchema = new Schema(
    { category_name: { type: String, required: true } },
    { timestamps: true }
);

const PolicyCategory = model('PolicyCategory', policyCategorySchema);
module.exports = PolicyCategory;
