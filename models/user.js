import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // optional but recommended
  },
});

// ✅ Apply passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // use email instead of default 'username'
});

const User = mongoose.model("User", userSchema);
export default User;
