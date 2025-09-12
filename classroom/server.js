import express from "express";
import userRoutes from "./routes/users.js";
import posts from "./routes/posts.js";
const app=express();
app.use(express.json()); 

// home root
app.get("/",(req,res)=>{
    res.send("This is home page !!.......");
});


app.use("/users", userRoutes);// users route
app.use("/posts", posts);// posts route


app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});