const { Schema, model } = require("mongoose");
const subCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const SubCategory = model("SubCategory", subCategorySchema);

module.exports = SubCategory;
