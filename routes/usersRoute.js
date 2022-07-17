const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/login", async function (req, res) {
  try {
    const result = await User.findOne({
      email: req.body.email,
    });
   if (result) {
      const validPassword = await bcrypt.compare(req.body.password, result.password);
    if(validPassword){
      res.send(result);
    }} else {
      res.status(500).json("Error");
    }
  }catch (error) {
    res.status(500).json(error);
  }
});

router.post("/register", async function (req, res) {
  const result = await User.findOne({email: req.body.email});
  if(!result){
  try {
    const newuser = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    newuser.password = await bcrypt.hash(newuser.password, salt);
    await newuser.save().then((doc) => res.status(201).send('User Registered Successfully'));
  } catch (error) {
    res.status(500).json(error);
  }
}else
res.status(500).json("User Already Exist");
  });


  module.exports = router;