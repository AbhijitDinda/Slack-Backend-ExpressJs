import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"],
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        required:[true,"password is require"]
    },
    username:{
        type:String,
        unique:[true,'username already exists'],
        match:[/^[a-zA-Z0-9]+$/,'username must contain letter and number']
    },
    avtar:{
        type:String,

    }
},{timestamps:true});

userSchema.pre('save', function saveUser(next){
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(user.password, SALT)
    user.password = hashedPassword;
    user.avtar = `https://robohash.org/${user.username}`
    next();
})

const user = mongoose.model('User',userSchema);
export default user;