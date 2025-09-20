import express from "express";
import userRoutes from "./routes/users.js";
import posts from "./routes/posts.js";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";
const app=express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sessionOptions={
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};
app.use(session(sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/register", (req,res)=>{
    let {name="anonouse"}=req.query;
    req.session.name=name;
    // res.send(name);
    req.flash("success", "User registered successfully!");
    res.redirect("/hello");
});
app.get("/hello", (req , res)=>{
    res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});
})
app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});