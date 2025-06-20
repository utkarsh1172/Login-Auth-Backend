const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json())
const bcrypt = require("bcrypt")

const mongoUrl =
  "mongodb+srv://utkarsh1172:admin@cluster0.zpbhjep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

  require('./UserDetails')
  const User=mongoose.model("UserInfo")
app.get("/", (req, res) => {
  res.send({ status: "Started not startdd yet mavcddn" });
});

app.post('/register', async(req, res) =>{
       const {name,email,mobile,password} = req.body;

       const oldUser = await User.findOne({email:email})

       if(oldUser) {
        return res.send({data: "User already existes!!"})
       }

       const encryptedPassword = await bcrypt.hash(password, 10)
       try{
        await User.create({
            name:name,
            email:email,
            mobile,
            password:encryptedPassword,
        });
        res.send({status:"ok", data:"User Created"})
       }catch (error) {
        res.send({status:"error", data:error})
       }
})
app.listen(5001, () => {
  console.log("Node js server started.");
});
