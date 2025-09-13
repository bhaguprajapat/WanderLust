import express from "express";
const router=express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { fileURLToPath } from "url";
import {listingSchema, reviewSchema} from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
// import path from "path";

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);app.set("view engine", "ejs");


// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));


const validateReview=(req ,res,next)=>{
    let {error}=reviewSchema.validate(res.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message.join(","));
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
// Listing route
router.get("/", async (req, res) => {
    try {
        const allListing = await Listing.find({}).sort({_id:-1});
        // res.send(allListing);
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        res.status(500).send(`Error fetching listings ${err}`);
    }
});
// create new data
router.get("/create", (req, res) => {
    try {
        res.render("listings/create.ejs");
    } catch (err) {
        console.log(err);
        res.send("Error fatching listiings");
    }
});
// store data
router.post("/", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing.");
    }
    listingSchema.validate(req.body);
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listings");
     
}));
// edit data
router.get("/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        res.send("500 , Something went wrong");
    }
});
// update data
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listing);
        res.redirect("/listings");
    } catch (err) {
        res.send("Something went wrong");

    }
});


// delete data
router.get("/:id/delete", async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        console.log(listing);
        res.redirect("/listings");
    } catch (err) {
        res.send("Something went wrong");
    }
});
// Show routes
router.get("/:id", async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
});

// store review
router.post("/:id/reviews",validateReview,wrapAsync(async (req , res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review generated");
    // res.send("New review saved !!");
    res.redirect(`/listings/${listing._id}`);
}));
// delete review
router.delete("/:id/reviews/:reviewId",wrapAsync(async (req , res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}));

export default router;