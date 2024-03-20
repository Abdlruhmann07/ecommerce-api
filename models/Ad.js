const { Schema, model, default: mongoose } = require("mongoose");
const adSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "title field is required"],
      trim: true,
      minlength: [5, "Title should contain at least 5 alphanumeric characters"],
      maxlength: [30, "Title should not contain more than 30 characters"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      minlength: [10, "description should contain at least 10 characters"],
      maxlength: [
        150,
        "description should not contain more than 150 characters",
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Ad must belongs to category"],
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: String,
      required: true,
    },
    //!
    price: {
      amount: {
        type: Number,
        required: true,
      },
      options: {
        type: String,
        enum: ["Negotaible", "Exchange", "Free"],
        default: null,
      },
    },
    condition: {
      type: String,
      enum: ["New", "Used"],
    },
    photos: {
      type: Array,
      of: String,
      default: [],
    },

    userInfo: {
      name: String,
      phoneNumber: String,
      contactMethod: {
        type: String,
        enum: ["Phone Number", "Chat", "Both"],
        default: "Both",
      },
      photo: String,
    },

    publishedIn: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },

    //! complete location attribute
    location: {},

    dynamicAdFields: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },

  // for daynamic attributes
  { strict: false }
);
let counter = 0;
adSchema.pre("save", async function (next) {
  if (!this.id) {
    if (counter === 0) {
      this.id = 1;
    } else {
      this.id = counter + 1;
    }
    counter = this.id;
  }
  next();
});
const Ad = model("Ad", adSchema);

module.exports = Ad;
