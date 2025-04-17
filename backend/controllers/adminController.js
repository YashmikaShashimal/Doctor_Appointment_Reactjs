import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js'; // Import userModel
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';


// API for adding doctor

const addDoctor = async (req,res) => {

  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // Check if file exists
    if (!imageFile) {
      return res.json({ success: false, message: "Image file is required" });
    }

    // checking for all data to add doctor

    if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
      return res.json({success:false,message:"Missing Details"})
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // validating password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Password should be at least 8 characters long" });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address); // Safely parse address
    } catch (err) {
      return res.json({ success: false, message: "Invalid address format. Address must be a valid JSON object." });
    }

    const doctorData = {
      name,
      email,
      password:hashedPassword,
      image:imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({success:true,message:"Doctor Added Successfully"})

  } catch (error) {
    console.error("Error:", error); // Log detailed error
    res.json({success:false,message:error.message})
  }
}

// api for the admin loging

const loginAdmin = async (req,res) => {
  try {
    const {email,password} = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET); // Fixed payload
      res.json({success:true,token})
    } else {
      res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
    console.error("Error:", error);
    res.json({success:false,message:error.message})
  }
}

// API get all doctors list fro admin panel
const allDoctors = async (req,res) => {
  try {

    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get all oppintment list

 const appointmentsAdmin = async (req,res) => {
  try {
    
    const appointments = await appointmentModel.find({})
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
 }

 //API for appointment cancellation

 const appointmentCancel = async (req,res) => {

  try {
    
    const {appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

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

// API to get dashboard data for admin panel

const adminDashboard = async (req,res) => {
  try {

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      users: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }
    res.json({success:true,dashData})
    
    
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message });
  }
}


export {addDoctor, loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}