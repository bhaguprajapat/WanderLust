import express from "express";
import userRoutes from "./routes/users.js";
import posts from "./routes/posts.js";
import cookieParser from "cookie-parser";
const app=express();
app.use(express.json()); 

app.use(cookieParser());
// cookies 
app.get("/getcookies",(req , res)=>{
    res.cookie("greet","hello");
    res.send("send you some cookies");
});
// home root
app.get("/",(req,res)=>{
    
    console.dir(req.cookies);
    res.send(req.cookies);
});


app.use("/users", userRoutes);// users route
app.use("/posts", posts);// posts route


app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});