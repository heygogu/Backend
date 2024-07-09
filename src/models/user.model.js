import mongoose, { Schema } from "mongooose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary URL
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String, //why string ?
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // if(this.isModified("password")){
  //     this.password=bcrypt.hash(this.password,10)
  //     next()
  // }

  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
  //10 is the number of hash rounds
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
  //return true or false , as compare takes time use async,
  //this.password refer ti encrypted password
};

//can write any property using methods , if it is not available it will be created

userSchema.methods.generateAccessToken = function () {
  //no need of async here as it is very fast
  return jwt.sign(
    {
      //payload
      _id: this._id, //from mongodb (lhs from schema)
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//these methods have access to our database using this
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      //payload
      _id: this._id, //from mongodb (lhs from schema)
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

// If I want to make a field searchable using a optimizable way, then make it's index true (although it is a little expensive but not that much)
