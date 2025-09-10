import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,   // ✅ typo fixed: "require" → "required"
  },
  description: String,
  img: {
    filename: {
      type: String,
      default: "ListingImg",
    },
    url: {
      type: String,
      default:
        "https://as1.ftcdn.net/jpg/04/67/92/34/1000_F_467923427_aESRkJ13OKNiIP5X6jGuNeLdcO7bv4LN.jpg",
      set: (v) =>
        v === ""
          ? "https://as1.ftcdn.net/jpg/04/67/92/34/1000_F_467923427_aESRkJ13OKNiIP5X6jGuNeLdcO7bv4LN.jpg"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ]
});

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
