const express = require('express');
const router = express.Router();

//user model
const users = require('../../models/user');

// Create user
router.post('/user', async (req, res) => {
  const { name, email, password, gender, profession, degree, university, graduation, location, job, jobtype } = req.body;

  try {
    // Check if the user with the same email already exists and isActive is true
    const alreadyExist = await users.findOne({ email, isActive: true });
    if (alreadyExist) {
      return res.status(200).json({ data: {}, msg: "User Already exists. Please Login" });
    }

    const newUser = new users({
      name,
      email,
      password,
      gender,
      profession,
      degree,
      university,
      graduation,
      location,
      job,
      jobtype,
      createdAt: Date.now(),
      notes: [],
      isActive: true,
    });

    const savedUser = await newUser.save();
    if (!savedUser) {
      throw Error('Something went wrong while creating the user');
    }

    return res.status(200).json({ data: savedUser, msg: "Registration successful. Please Login" });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
