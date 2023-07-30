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

// Get user details for login
router.post('/login', async (req, res) => {
  try {
    const user = await users.findOne({ $and: [{ email: req.body.email }, { isActive: true }] });

    if (user) {
      if (user.password === req.body.password) {
        res.status(200).json({ data: user, msg: "Login Successfully" });
      } else {
        res.status(401).json({ data: {}, msg: "Password is wrong. Please enter the correct password" });
      }
    } else {
      res.status(401).json({ data: user, msg: "Unauthorized user. Please register" });
    }
  } catch (err) {
    res.status(500).json({ data: {}, msg: err.message });
  }
});

  // Get user details for profile page
router.get('/profile', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await users.findOne({ email, isActive: true });

    if (user) {
      return res.status(200).json({ data: user, msg: "User details fetched successfully" });
    } else {
      return res.status(404).json({ data: {}, msg: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ data: {}, msg: err.message });
  }
});

// Update user profile
router.put('/updateProfile', async (req, res) => {
  const { email, gender, profession, degree, university, graduation } = req.body;

  try {
    const user = await users.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({ data: {}, msg: "User not found" });
    }

    user.gender = gender;
    user.profession = profession;
    user.degree = degree;
    user.university = university;
    user.graduation = graduation;

    const updatedUser = await user.save();

    if (!updatedUser) {
      throw Error('Something went wrong while updating the user');
    }

    return res.status(200).json({ data: updatedUser, msg: "User profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ data: {}, msg: err.message });
  }
});

module.exports = router;
