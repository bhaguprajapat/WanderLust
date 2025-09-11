import mongoose from "mongoose";

const Schema = mongoose.Schema;
// create review schema
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:0,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});
const Review=mongoose.model("Review",reviewSchema);
export default Review;