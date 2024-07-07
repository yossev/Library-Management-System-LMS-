import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import 'dotenv/config';

mongoose.connect(process.env.URL).then((ans) =>{
    console.log("Connection Successful")
}).catch((err) => {
    console.log("Couldnt Connect Mongoose to the DB "+ err)
})

const Schema =  mongoose.Schema

const mongodb =  mongoose.connection


const UserSchema =  mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})


UserSchema.statics.login = async function(email, password){
const user = await this.findOne({email:email})

if (user === null){
    return "Cannot Find User!"
}else{
    const auth = await bcrypt.compare(password, user.password)
    if(!auth){
        return "Incorrect Email or Password!"
    }
}
return user
console.log("Logged in Successfully")
}

const User = mongoose.model('User', UserSchema)

export { User };