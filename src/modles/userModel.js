import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({

    userName: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
        trim: true,
        index: true

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
        index: true
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
    },
    watachHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: true
    },
    // short lived token 
    accesstoken: {
        type:String
    },
    // long lived token 
    refereshToken: {
        type: String
    }

},
    {
        timestamps: true
    }
)


// hasing the passwod 

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 16)
    next();
})

//  checking the password 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccesstoken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            userName: this.userName
        },
        "1234" ,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefereshtoken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
       "123",
        {
            expiresIn: "10d"
        }
    )
}


export const User = mongoose.model("User", userSchema)