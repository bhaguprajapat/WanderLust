import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import {listingSchema, reviewSchema} from "./schema.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";
import listingRoute from "./routes/listing.js";
import session from "express-session";
import flash from "connect-flash";
// __dirname, __filename banane ka tarika (ESM me default nahi hote)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);  
app.use(express.static(path.join(__dirname,"public")));
// Database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const sessionOption={
    secret:"mysupersecertcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, // + day* hours * min * seconds *milsec
        maxAge: 7*24*60*60*1000,
        httpOnly:true  
    }

};
app.use(session(sessionOption));
app.use(flash());
// create middlware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    next();
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("✅ Database connected!"))
    .catch((err) => console.error("❌ DB connection error:", err));

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
app.get("/", async (req, res) => {
    try {
        const allListing = await Listing.find({}).sort({_id:-1});
        // res.send(allListing);
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        res.status(500).send(`Error fetching listings ${err}`);
    }
});
// listing routes
app.use("/listings",listingRoute);


// if route not found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
// error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message); 
    res.render("error.ejs",{message});
});
// Start server
app.listen(8080, () => {
    console.log("🚀 Server is running on http://localhost:8080");
});
