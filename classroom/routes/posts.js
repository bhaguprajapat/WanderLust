import express from "express";
const router=express.Router();
// Index user
router.get("/",(req,res)=>{
    res.send("Index posts !!.......");
});
// Show user
router.get("/:id",(req,res)=>{
    res.send("Show posts !!.......");
});
// store pos
router.post("/",(req,res)=>{
    res.send("Store posts!!.......");
});
// delete pos
router.delete("/:id",(req,res)=>{
    res.send("delete posts!!.......");
});

export default router;