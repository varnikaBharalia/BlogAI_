const {Schema,model} = require("mongoose");
const {createHmac,randomBytes} = require("crypto");

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    profileImage:{
        type:String,
        default: "/images/default.png",
    },
},{timestamps:true});

userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password")) return next();

    const salt = randomBytes(16).toString();

    const hashPassword = createHmac("sha256",salt)

    .update(user.password)  
    .digest("hex");        

    user.salt = salt;
    user.password = hashPassword

    next();
})

const User = model("User",userSchema);
module.exports = User;