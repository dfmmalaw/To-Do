import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import SendMail from "../helpers/sendMail.js";
import {
  GOOGLE_CLIENT,
  JWT_ACCOUNT_ACTIVATION,
  EMAIL_FROM,
  CLIENT_URL,
  JWT_SECRET,
  JWT_RESET_PASSWORD,
} from "../constants/config.const.js";
import { encryptData, decryptData } from "../utils/crypto.util.js";

const client = new OAuth2Client(GOOGLE_CLIENT);

//passes name, email and password values to function params
export const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //attempts to find user existing user by email
    const user = await User.findOne({ email: decryptData(email) });
    //if user exists then error thrown
    if (user)
      return res.status(400).json({
        error: "Email is already taken.",
      });
    
    //if not user exists then user is registered and JWT token is generated
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "30m",
      }
    );

    //email created with activation link (including token)
    const emailData = {
      from: EMAIL_FROM,
      to: decryptData(email),
      subject: "Account activation link",
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${CLIENT_URL}</p>
            `,
    };

    console.log('email data - ', emailData);

    //email sent to user
    SendMail(emailData, res);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error,
    });
  }
};

//Activates the new user
export const activationController = async (req, res) => {
  const { token } = req.body;
  //if token exists it is then verified
  if (token) {
    try {
      //check to see if token has expired
      const decoded = jwt.verify(token, JWT_ACCOUNT_ACTIVATION);
      const expiresAt = new Date(decoded.exp * 1000);
      if (new Date() > expiresAt) {
        return res.status(403).json({
          error: "Token is expired. Please signup again",
        });
      }
      //if token is valid, then checks to see if user already exists and throws error
      const { name, email, password } = decoded;
      const userExits = await User.findOne({ email: decryptData(email) });
      if (userExits) {
        return res.status(403).json({
          error: "Your account is already active",
        });
      }
      //if user doesn't exist then creates a new user object
      const user = await User.create({
        name: decryptData(name),
        email: decryptData(email),
        password: decryptData(password),
      });
      //if user is not able to be created then throw error
      if (!user) {
        return res.status(500).json({
          error: "Please try again",
        });
      }
      //if account is created then return success message
      return res.json({
        token,
        message: "Your Account has been created",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Something went wrong. Please try again",
      });
    }
  } else {
    return res.status(500).json({
      error: "Something went wrong. Please try again",
    });
  }
};

//authenicated user and then lets them sign in
export const signinController = async (req, res) => {
  try {
    // check if user exists, and if user does not exist error thrown
    const user = await User.findOne({ email: decryptData(req.body.email) });
    if (!user) {
      return res.status(404).json({
        error: "User with that email does not exist. Please signup",
      });
    }

    //checks if password is correct
    if (!user.authenticate(decryptData(req.body.password))) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }
    //if user exists, token is generated and user is logged in
    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const { _id, name, email } = user;

    return res.json({
      message: "Login Succesfull",
      token,
      user: {
        _id,
        name: encryptData(name),
        email: encryptData(email),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong. Please try again later",
    });
  }
};

//allows user to have password reset link sent to them
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    //check to see if user exists
    const user = await User.findOne({ email: decryptData(email) });
    //if user doesn't exist throw error
    if (!user)
      return res.status(400).json({
        error: "User with that email does not exist. Please Sign up",
      });
    //if user exists, generate token with 30m expiration
    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_RESET_PASSWORD,
      {
        expiresIn: "30m",
      }
    );

    //email created with reset link
    const emailData = {
      from: EMAIL_FROM,
      to: decryptData(email),
      subject: `Password Reset link`,
      html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${CLIENT_URL}/auth/reset-password/${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${CLIENT_URL}</p>
                `,
    };

    //update user object with reset password link (including token)
    const updatedUser = await user.updateOne({ resetPasswordLink: token });

    //if issue updating user throw error
    if (!updatedUser)
      return res.status(400).json({
        error: "Database connection error on user password forgot request",
      });

    //sends email to user with reset link
    SendMail(emailData, res);
  } catch (error) {}
};

//allows user to reset password
export const resetPasswordController = async (req, res) => {
  // const { resetPasswordLink, newPassword } = req.body;
  const { password1 } = req.body;
  let token = req.params.token;
  try {
    //if token exists, verify if it is expired
    if (token) {
      const decoded = jwt.verify(token, JWT_RESET_PASSWORD);
      const expiresAt = new Date(decoded.exp * 1000);
      if (new Date() > expiresAt) {
        return res.status(403).json({
          error: "Token is expired. Please try again",
        });
      }
      //check to seee if user exists
      const user = await User.findOne({ resetPasswordLink: token });
      if (!user)
        return res.status(400).json({
          error: "Invalid token",
        });

      //if user exists then persist updated password
      user.password = decryptData(password1);
      user.resetPasswordLink = "";

      await user.save();

      return res.status(201).json({
        message: "Password Updated Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Expired link. Try again",
    });
  }
};

// Allows user to login using Google client
export const googleController = async (req, res) => {
  const { idToken } = req.body;
  try {
    //verify Id Token
    const verified = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT,
    });

    //verify email
    const { email_verified, name, email } = verified.payload;
    if (!email_verified)
      return res.status(400).json({
        error: "Google login failed. Try again",
      });

    //check if user exists and allow user to log in
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { _id, email, name } = user;
      return res.json({
        message: "Login Succesfull",
        token,
        user: { _id, email, name },
      });
    } else {
      let password = email + JWT_SECRET;

      const user = await User.create({
        name,
        email,
        password,
      });

      if (!user)
        return res.status(400).json({
          error: "User signup failed with google",
        });
      const token = jwt.sign({ _id: data._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      const { _id, email, name } = data;
      return res.json({
        message: "Login Succesfull",
        token,
        user: { _id, email, name },
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Error while google login. Please try again",
    });
  }
};
