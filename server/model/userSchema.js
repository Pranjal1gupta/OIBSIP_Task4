const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config({ path:'./config.env'});

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})


userSchema.pre('save',async function(next){
    console.log("hello from hash")
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// generating token 
userSchema.methods.generateAuthToken= async function(){
    console.log("from userschema");
    try{
        let token=jwt.sign({_id : this._id},process.env.SECRET_KEY);
        this.tokens= this.tokens.concat({token:token});
        await this.save();
        return token;
        
    }catch(err){
        console.log(err);
    }
}

const User=mongoose.model('users',userSchema);
module.exports=User;
