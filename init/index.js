const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


// .connect with data base 
const MONGO_url="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
        console.log("database connected !!")
    }).catch((err)=>{
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_url);
};

const initDB=async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was inilitized !!");
}
initDB();