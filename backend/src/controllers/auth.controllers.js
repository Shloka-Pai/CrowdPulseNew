const adminModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//await function pauses the function 
//can only be used inside the async function
//Step 1: Call database
//Step 2: WAIT
//Step 3: Get result
//Step 4: Continue execution

async function registerAdmin(req, res) {
  const { name, email, password } = req.body;

  const isAlreadyExists = await userModel.exists({ email });

  if (isAlreadyExists) {
    return res.status(400).json({
      message: "User already exists!",
    })
  }

  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS))

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  })

  const token = jwt.sign(
    {
      id: user._id,
    },process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  )

  res.cookie('token', token)
  res.status(201).json({
    message: 'Admin successfully registered!',
    admin: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
    }
  })
}

async function loginAdmin(req, res) {
  const {email, password} = req.body

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message: 'Invalid email or password!'
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(400).json({
      message: 'Inavlid email or password!'
    })
  }

  const token = jwt.sign({
    id: user._id
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  })

  res.cookie('token', token)
  res.status(201).json({
    message: 'Admin successfully logged in!',
    admin: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    }
  })
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