const dotenv=require('dotenv');
dotenv.config({ path:'./config.env'});

const express=require('express');
const cors = require('cors');
const mongoose=require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./router/auth');
const app=express();

const port=process.env.PORT;

require("./db/conn")

router.use(cookieParser);
app.use(express.json());
app.use(cors());

app.use(require("./router/auth"));


// app.get('/login',middleware,(req,res)=>{
//     res.send("Hello World from login...........");
// })


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
}    
)