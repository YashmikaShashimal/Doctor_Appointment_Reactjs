import doctorModel from "../models/doctorModel.js"

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"


const changeAvailability = async (req, res) => {
  try {

    const { docId } = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    res.json({success:true, message: 'Availability Changed'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

const doctorList = async (req,res) => {
  try {
    
    const doctors = await doctorModel.find({}).select(['-password','-email'])

    res.json({success:true, doctors})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API for doctor login 

const loginDoctor = async (req, res) => {
  try {

    const {email, password} = req.body
    const doctor = await doctorModel.findOne({email})

    if (!doctor) {
      return res.json({success:false, message: 'Invalid credentials'})
    }
    
    const isMatch = await bcrypt.compare(password, doctor.password)
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
      res.json({success:true, token})
    } else {
      res.json({success:false, message: 'Invalid credentials'})
    }
    
  } catch (error) {
     console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get doctor appointments for doctor oanel

const appointmentsDoctor = async (req, res) => {
  try {

    const { docId } = req.body

    const appointments = await appointmentModel.find({ docId })

    res.json({success:true, appointments})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
  try {

    const {docId, appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
      return res.json({success:true, message: 'Appointment Completed'})
    } else {
      return res.json({success:false, message: 'Mark Failed'})
    }
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to cancel appointment completed for doctor panel

const appointmentCancel = async (req, res) => {
  try {

    const {docId, appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
      return res.json({success:true, message: 'Appointment Cancelled'})
    } else {
      return res.json({success:false, message: 'Cancellation is Failed'})
    }
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to get dashboard data for doctor panel

const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    // Fetch all appointments for the doctor
    const appointments = await appointmentModel.find({ docId });

    // Calculate earnings
    let earnings = 0;
    let patients = new Set(); // Use a Set to ensure unique patient IDs

    appointments.forEach((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
      patients.add(item.userId); // Add unique patient IDs
    });

    const dashData = {
      earnings,
      appointments: appointments.length, // Total number of appointments
      patients: patients.size, // Total unique patients
      latestAppointments: appointments.reverse().slice(0, 5), // Latest 5 appointments
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//API to get doctor profile data doctor panel

const doctorProfile = async (req, res) => {
  try {

    const { docId } = req.body

    const profileData = await doctorModel.findById(docId).select(['-password'])

    res.json({success:true, profileData})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
//API to update doctor profile data from doctor panel

const doctorProfileUpdate = async (req, res) => {
  try {

    const { docId, fees, address, available } = req.body
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

    res.json({success:true, message: 'Profile Updated'})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, doctorProfileUpdate}