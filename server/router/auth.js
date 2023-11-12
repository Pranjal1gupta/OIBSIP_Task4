const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Authenticate = require("../middleware/Authenticate");


require("../db/conn");
const User = require("../model/userSchema");

// router.get("/", (req, res) => {
//   res.send("Hello World...........");
// });


router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    return res.status(422).json({ error: "Please fill the fields properly " });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(409).json({ error: "Email already Exists" });
    } else if (password !== cpassword) {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password are not same" });
    } else {
      const user = new User({ name, email, password, cpassword });
      // hash perform here
      await user.save();
      res.status(201).json({ message: "user registered successfully " });
    }
  } catch (err) {
    console.log(err);
  }
});

  // -------- login router ---------

  router.post('/signin',async(req,res)=>{
      try{
          const {email,password}=req.body;
          if(!email || !password){
              return res.status(400).json({error:"Please fill the fields properly "});
          }

          const userLogin =await User.findOne({email:email});
          // console.log(userLogin);

          if(userLogin){

              const isMatch=await bcrypt.compare(password,userLogin.password);

              const token = await userLogin.generateAuthToken();

              res.cookie("jwtoken",token,{
                  expires:new Date(Date.now() + 25892000000),
                  httpOnly:true
              });
              console.log(token);

              if(!isMatch){
                  res.status(401).json({error:"password do not match"});
              }
              else{
                  res.status(201).json({message:"user signin successfully"});
              }
          }
          else{
                  res.status(400).json({error:"user error"});
          }
      }catch(err){
          console.log(err);
      }
  });

//-----------about router --------

router.get("/about",Authenticate,(req,res)=>{
    console.log("hello about");
    res.send(req.rootUser);
});


// ------------logout--------------
router.get("/logout",(req,res)=>{
  console.log("hello logout about");
  res.clearCookie("jwtoken",{path:"/"});
  res.status(200).send("user logout");
});

router.get("/getdata/:email", async (req, res) => {
  try {
      const {email} = req.params;
      const indivisualuser = await User.findOne({email:email});
      console.log(indivisualuser);
      res.status(201).json(indivisualuser);
  }
  catch (error) {
      console.log(error);
      res.status(422).json(error);
  }
})

module.exports = router;
