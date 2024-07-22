const express = require("express");
const router = express.Router();

//user model
const User = require("../../models/user");
const JobApplication = require("../../models/jobApplications.js");

// Create user
router.post("/user", async (req, res) => {
  const {
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
  } = req.body;

  try {
    // Check if the user with the same email already exists and isActive is true
    const alreadyExist = await User.findOne({ email, isActive: true });
    if (alreadyExist) {
      return res
        .status(200)
        .json({ data: {}, msg: "User Already exists. Please Login" });
    }

    const newUser = new User({
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
      throw Error("Something went wrong while creating the user");
    }

    return res
      .status(200)
      .json({ data: savedUser, msg: "Registration successful. Please Login" });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
});

// Get user details for login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      $and: [{ email: req.body.email }, { isActive: true }],
    });

    if (user) {
      if (user.password === req.body.password) {
        res.status(200).json({ data: user, msg: "Login Successfully" });
      } else {
        res
          .status(401)
          .json({
            data: {},
            msg: "Password is wrong. Please enter the correct password",
          });
      }
    } else {
      res
        .status(401)
        .json({ data: user, msg: "Unauthorized user. Please register" });
    }
  } catch (err) {
    res.status(500).json({ data: {}, msg: err.message });
  }
});

// Get user details for profile page
router.get('/profile', async (req, res) => {
  const email = req.query.email;

  try {
    const user = await User.findOne({ email }).populate('jobApplications');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update user profile
router.put('/updateProfile', async (req, res) => {
  const { email, ...updatedFields } = req.body;

  try {
    let user = await User.findOneAndUpdate(
      { email },
      { $set: updatedFields },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({ data: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/user-info", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ msg: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/apply-job', async (req, res) => {
  const { email, jobId, jobTitle, companyName } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(404).json({ msg: "User not found. Please register" });
    }

    // Create a new job application
    const newJobApplication = new JobApplication({
      userId: user._id,
      jobId,
      jobTitle,
      companyName,
    });

    const savedJobApplication = await newJobApplication.save();
    if (!savedJobApplication) {
      throw new Error('Something went wrong while applying for the job');
    }

    // Add the job application reference to the user's jobApplications array
    user.jobApplications.push(savedJobApplication._id);
    await user.save();

    return res.status(200).json({ data: savedJobApplication, msg: "Application submitted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
