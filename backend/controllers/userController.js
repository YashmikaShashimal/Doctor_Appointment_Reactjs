import validator from "validator";

import bcrypt from 'bcryptjs';
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import crypto from "crypto";

// API to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token }); // Ensure token is returned with the key 'token'
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token }); // Ensure token is returned with the key 'token'
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data

const getProfile = async (req,res) => {

  try {
    
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')

    res.json({success:true,userData})

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }

}

// API to update user profile

const updateProfile = async (req,res) => {

  try {
    
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

    if (imageFile) {
      
      // upload image to cloudnary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageUrl = imageUpload.secure_url
      
      await userModel.findByIdAndUpdate(userId,{image:imageUrl})
    }

    res.json({success:true,message:"Profile Updated"})

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }

}

// API to book appointment

const bookAppointment = async (req,res) => {
  
  try {

    const {userId, docId, slotDate, slotTime} = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({success:false,message:'Doctor not available'})
    }

    let slots_booked = docData.slots_booked

    // checking for slot availability

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({success:false,message:'Slots not available'})
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // save new slots data in doc data

    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:'Appointment Booked'})
    
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }

}

// API to get user appointments for frontend my-appointment page

const listAppointment = async(req,res) => {

  try {
    
    const {userId} = req.body
    const appointments = await appointmentModel.find({userId})

    res.json({success:true,appointments}) // Fixed typo here

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }

}

// API to cancel appointment

const cancelAppointment = async (req,res) => {

  try {
    
    const {userId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify appointement user

    if (appointmentData.userId.toString() !== userId) {
      return res.json({success:false,message:'Unauthorized action'})
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

    // releasing doctors slots

    const {docId, slotDate, slotTime} = appointmentData

    const DoctorData = await doctorModel.findById(docId)

    let slots_booked = DoctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId, {slots_booked})

    res.json({success:true,message:'Appointment Cancelled'})

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }

}

// API to initiate payment using PayHere
const paymentPayHere = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled or not found" });
    }

    const paymentDetails = {
      merchant_id: process.env.PAYHERE_MERCHANT_ID,
      return_url: "http://localhost:5173/my-appointments",
      cancel_url: "http://localhost:5173/my-appointments",
      notify_url: "http://localhost:4000/api/user/verify-payhere",
      order_id: appointmentId,
      items: "Doctor Appointment Fee",
      amount: appointmentData.amount.toFixed(2), // Ensure amount is a string with two decimal places
      currency: process.env.CURRENCY || "USD", // Default to "USD" if not set
      first_name: appointmentData.userData.name.split(" ")[0],
      last_name: appointmentData.userData.name.split(" ")[1] || "",
      email: appointmentData.userData.email,
      phone: appointmentData.userData.phone || "0000000000",
      address: appointmentData.userData.address.line1,
      city: "Colombo",
      country: "Sri Lanka",
    };

    console.log("Generated Payment Details:", paymentDetails); // Debugging log

    res.json({ success: true, paymentDetails });
  } catch (error) {
    console.error("Error in paymentPayHere:", error); // Debugging log
    res.json({ success: false, message: error.message });
  }
};

// API to verify payment using PayHere
const verifyPayHere = async (req, res) => {
  try {
    const { order_id, status_code, md5sig } = req.body;

    if (status_code === "2") {
      const appointmentData = await appointmentModel.findById(order_id);
      if (!appointmentData) {
        return res.json({ success: false, message: "Appointment not found" });
      }

      const generatedMd5sig = crypto
        .createHash("md5")
        .update(
          `${process.env.PAYHERE_MERCHANT_ID}${order_id}${appointmentData.amount.toFixed(2)}${process.env.CURRENCY}${status_code}${crypto
            .createHash("md5")
            .update(process.env.PAYHERE_SECRET_KEY)
            .digest("hex")}`
        )
        .digest("hex");

      if (generatedMd5sig === md5sig) {
        await appointmentModel.findByIdAndUpdate(order_id, { payment: true });
        return res.json({ success: true, message: "Payment Successful" });
      }
    }

    res.json({ success: false, message: "Payment Verification Failed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser, loginUser, getProfile, updateProfile, bookAppointment, 
  listAppointment, cancelAppointment, paymentPayHere, verifyPayHere 
};