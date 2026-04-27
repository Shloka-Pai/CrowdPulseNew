const User = require("../models/user.model");  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerAdmin(req, res) {
  const { name, email, password, role } = req.body;

  const isAlreadyExists = await User.exists({ email });

  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User already exists!",
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS) || 10
  );

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'volunteer'
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'supersecretkey123',
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  res.status(201).json({
    message: "Admin successfully registered!",
    admin: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  });
}

async function loginAdmin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password!",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password!",
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || 'supersecretkey123',
    { expiresIn: "1h" }
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "Admin successfully logged in!",
    admin: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  });
}

async function logoutAdmin(req, res) {
  res.clearCookie('token')
  res.status(200).json({
    message: 'Admin logged out succesfully!'
  })
}

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
}