import express from "express";
const router=express.Router();
// Index user
router.get("/",(req,res)=>{
    res.send("Index user !!.......");
});
// Show user
router.get("/:id",(req,res)=>{
    res.send("Show user !!.......");
});
// store users
router.post("/",(req,res)=>{
    res.send("Store user!!.......");
});
// delete users
router.delete("/:id",(req,res)=>{
    res.send("delte user!!.......");
});

export default router;