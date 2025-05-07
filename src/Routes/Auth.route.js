const User = require("../model/User.model");
var jwt = require("jsonwebtoken");
const {
  Incriptpassword,
  SendverificationMail,
  checkpassword,
} = require("../Service/common");
const Router = require("express").Router;
const AuthRouter = Router();
require("dotenv").config();
const secretKey = "my_super_secret";
AuthRouter.post("/admin_login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(200).json({
        message: "Email and Password are required",
        s: 0,
      });
    }

    const checkuser = await User.findOne({ email, role: "admin" });

    if (!checkuser) {
      return res.status(200).json({
        message: "Admin user not found!",
        s: 0,
      });
    }

    const hashedpassword = checkuser.password;
    const isPasswordCorrect = await checkpassword(password, hashedpassword);

    if (!isPasswordCorrect) {
      return res.status(200).json({
        message: "Wrong Credentials!",
        s: 0,
      });
    }

    if (!checkuser.is_verified) {
      return res.status(200).json({
        message: "Admin account not verified!",
        s: 0,
      });
    }

    return res.status(200).json({
      message: "Login Successful",
      success: true,
      data: checkuser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
      s: 0,
    });
  }
});

AuthRouter.post("/register", async (req, res) => {
  const { email, password, last_name, first_name, role } = req.body;
  try {
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(200).json({ s: 0, message: "User already exists." });
    }
    const hashedPassword = await Incriptpassword(password);
    const token = jwt.sign({ email }, secretKey, { algorithm: "HS256" });
    const apikey = jwt.sign({ first_name }, secretKey, { algorithm: "HS384" });

    let code = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      token,
      apikey,
      Verification_code: code,
      is_Verified: false,
      role,
    });

    const savedUser = await newUser.save();

    await SendverificationMail(email, code);
    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: savedUser,
    });
    p;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

AuthRouter.post("/verifiyemail", async (req, res) => {
  const { email, Verification_code } = req.body;

  try {
    if (!email || !Verification_code) {
      return res.status(200).json({ message: "Email and code are required." });
    }
    const getUserinfo = await User.findOne({ email });

    if (!getUserinfo) {
      return res.status(200).json({ message: "User Not Found" });
    }
    if (Verification_code == getUserinfo?.Verification_code) {
      const UpdateUserAuth = await User.findOneAndUpdate(
        { _id: getUserinfo?._id },
        {
          $set: {
            Verification_code: null,
            is_verified: true,
          },
        }
      );

      const updatedData = await User.findById({ _id: UpdateUserAuth?._id });
      return res.status(200).json({
        success: true,
        message: "User verified successfully.",
        data: updatedData,
      });
    } else {
      console.log(Verification_code, "sent code");
      return res.status(200).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = AuthRouter;
