const express = require("express");
const router = express.Router();
const userCollection = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const UPLOAD_FOLDER = "./public/image";
var nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");

//----------------------- Multer -----------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    if (file) {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
      console.log("🚀 ~ fileName:", fileName);
      cb(null, fileName + fileExt);
    }
  },
});
var upload = multer({
  storage: storage,
});
//---------------------------------------------//

//----------------------- Auth(VerifyToken,jwt) -----------------//
// Route to verify token
router.get("/verifyToken", verifyToken, (req, res) => {
  const user = req.user;
  res.send(user);
});
//---------------------------------------------//

//----------------------- GET -----------------//
// All User Data Get
router.get("/allusers", async (req, res) => {
  try {
    const user = await userCollection.find().toArray();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});
// Single User Data Get
router.get("/singleuser/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await userCollection.findOne({ email });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});
//---------------------------------------------//


//----------------------- POST -----------------//
// Manual Signup
router.post("/signup", upload.single("images"), async (req, res) => {
  const { name, email, role, password } = req.body;
  console.log("🚀 ~ router.post ~ req.body:", req.body)
  const filenames = req.file.filename;
  const query = { email: email };

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUserByEmail = await userCollection.findOne(query);

  if (existingUserByEmail) {
    return res.status(400).json({
      error:
        "An account with this email already exists. Please use a different email.",
    });
  }

  // Hash password and create new user object
  const hashedPassword = await bcrypt.hash(password, 10);
  const path = "http://localhost:5000/image/";
  const userData = {
    name: name,
    email: email,
    role: role,
    photoURL: path + filenames,
    password: hashedPassword,
  };

  const insertedData = await userCollection.insertOne(userData);
  res.status(200).json({ message: "User created successfully", insertedData });
});
// Email pass login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Input validation:
    if (!email || !password) {
      res.status(401).json({ error: "Invalid email or password." });
    }

    // Search by email only:
    const user = await userCollection.findOne({ email });

    // Handle cases where no user is found or password is incorrect:
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
});
// Google Signup + Login
router.post("/signup/google", async (req, res) => {
  const { name, email, role, photoURL } = req.body;
  const query = { email: email };

  const existingUser = await userCollection.findOne(query);
  if (!existingUser) {
    const userData = {
      name: name,
      email: email,
      role: role,
      photoURL: photoURL,
      password: "",
    };

    const insertedData = await userCollection.insertOne(userData);
  }

  const user = await userCollection.findOne(query);
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.send({ token, user });
});
//---------------------------------------------//

//----------------------- PUT -----------------//
// Update Profile
router.put("/update/:email", upload.single("images"), async (req, res) => {
  try {
    const email = req.params.email;
    const { name, password, about, role, oldPass } = req.body;
    console.log("🚀 ~ router.put ~ oldPass:", oldPass);
    const filename = req.file ? req.file.filename : undefined;
    const newPassword = password ? password : undefined;

    let userToUpdate = {};

    // Retrieve existing user data
    const existingUser = await userCollection.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }
    const paths = "http://localhost:5000/image/";
    // Update fields provided in the request body
    if (name) userToUpdate.name = name;
    if (filename) userToUpdate.photoURL = paths + filename;

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userToUpdate.password = hashedPassword;
    } else {
      userToUpdate.password = oldPass;
    }

    console.log("testing", userToUpdate);
    // Update user data in the database
    const result = await userCollection.updateOne(
      { email },
      { $set: userToUpdate }
    );

    // Check if the role is ""
    // Role wise update if any
    if (role === "") {
    }

    const user = await userCollection.findOne({ email });

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
//---------------------------------------------//

//----------------------- DELETE -----------------//
// Delete User
router.delete("/user/delete/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    if (!userEmail) {
      return res.status(400).json({ error: "Email parameter is missing." });
    }

    // Find the user by email to get their role
    const user = await userCollection.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Delete the user from the users collection
    const query = { email: userEmail };
    const result = await userCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
//------------------------------------------------//

//----------------------- Password Reset -----------------//
// Password Reset
router.post("/forgot-password/:email", async (req, res) => {
  const userEmail = req.params.email;
  console.log("🚀 ~ router.post ~ email:", userEmail);

  try {
    const user = await userCollection.findOne({ email: userEmail });
    if (!user) {
      return res.send({ Status: "User not existed" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "akram.iiuc.ctg@gmail.com",
        pass: "cxpc pneg ktno bmvb",
      },
    });

    var mailOptions = {
      from: "akram.iiuc.ctg@gmail.com",
      to: user.email,
      subject: "Reset Password Link",
      text: `http://localhost:5173/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send({ Status: "Error" });
  }
});
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.json({ Status: "Error with token" });
    }

    // Hash the new password
    const hash = await bcrypt.hash(password, 10);

    // Update the user's password
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hash } }
    );

    if (result.modifiedCount === 1) {
      // Password updated successfully
      return res.send({ Status: "Success" });
    } else {
      // No document was modified (no user found with the provided ID)
      return res.status(404).json({ Status: "User not found." });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).send({ Status: "Error" });
  }
});
//-------------------------------------------------------//

//----------------------- Pending -----------------//
//-----------------------------------------------//

module.exports = router;
