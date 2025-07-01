const express = require("express");
const app = express();
const mongoose = require("mongoose");
// app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const mongoUrl =
  "mongodb+srv://utkarsh1172:admin@cluster0.zpbhjep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });
require("./UserDetails");
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { name, email, mobile, password, userType } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      mobile,
      password: encryptedPassword,
      userType
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    if (res.status(201)) {
      return res.send({ status: "ok", data: token, userType: oldUser.userType });
    } else {
      return res.send({ error: "error" });
    }
  }
});

app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;

    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});
app.get("/get-all-user", async (req, res) => {
  try {
    const data = await User.find({});
    res.send({ status: "Ok", data: data });
  } catch (error) {
    return res.send({ error: error });
  }
});
app.post("/update-user", async (req, res) => {
  const { name, email, mobile, image, gender, profession } = req.body;
  console.log(req.body);
  try {
    await User.updateOne(
      { email: email },
      {
        $set: {
          name,
          mobile,
          image,
          gender,
          profession,
        },
      }
    );
    res.send({status:"Ok",data:"Updated"})
  } catch (error) {
    return res.send({ error: error });
  }
});


app.post("/delete-user",async (req, res) => {
 const {id}=req.body;
 try {
  await User.deleteOne({_id:id});
  res.send({status:"Ok",data:"User Deleted"});
 } catch (error) {
  return res.send({ error: error });
  
 }
})


app.listen(5001, '0.0.0.0', () => {
  console.log("Server running at 0.0.0.0:5001");
});