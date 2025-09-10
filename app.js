import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";
import Listing from "./models/listing.js";

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

async function main() {
    await mongoose.connect(MONGO_URL);
}
main()
    .then(() => console.log("✅ Database connected!"))
    .catch((err) => console.error("❌ DB connection error:", err));

// Home route
app.get("/", (req, res) => {
    res.send("This is Home page");
});

// Listing route
app.get("/listing", async (req, res) => {
    try {
        const allListing = await Listing.find({});
        res.render("listings/index", { allListing });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
});
// create new data
app.get("/listing/create", (req, res) => {
    try {
        res.render("listings/create.ejs");
    } catch (err) {
        console.log(err);
        res.send("Error fatching listiings");
    }
});
// store data
app.post("/listing", wrapAsync(async (req, res) => {
    // const { error } = listingSchema.validate(req.body);
    // if (error) {
    //     // take first error message
    //     const msg = error.details.map(el => el.message).join(",");
    //     throw new ExpressError(400, msg);
    // }
    if(!req.body.listing){
        throw new ExpressError(400 , "Send valid data for listing.");
    }
    listingSchema.validate(req.body);
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("/listing");
     
}));
// edit data
app.get("/listings/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        res.send("500 , Something went wrong");
    }
});
// update data
app.put("/listing/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, req.body.listing);
        res.redirect("/listing");
    } catch (err) {
        res.send("Something went wrong");

    }
});


// delete data
app.get("/listings/:id/delete", async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        console.log(listing);
        res.redirect("/listing");
    } catch (err) {
        res.send("Something went wrong");
    }
});
// Show routes
app.get("/listings/:id", async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    } catch (err) {
        res.status(500).send("Error fetching listings");
    }
});

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
