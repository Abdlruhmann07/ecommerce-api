const { Schema, model } = require("mongoose");
const categorySchema = new Schema({
  title: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
    trim: true,
    minlength: [2, "Category name should contain at least 2 characters"],
    maxlength: [50, "Category name should not contain more than 50 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [255, "Description should not contain more than 255 characters"],
  },

  subCategories: [{
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
  }],

  dynamicAdFields : {
    type: Map,
    of: Schema.Types.Mixed,
  },
});

const Category = model("Category", categorySchema);

module.exports = Category;
