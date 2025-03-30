import validator from 'validator';
import bycrypt from 'bcrypt';
import { v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';

// API for adding doctor

const addDoctor = async () => {

  try {
    const { name, email, password, image, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file

    // checking for alll data to add doctor

    if(!name || !email || !password || !imageFile || !speciality || !degree || !experience || !about || !fees || !address){
      return res.json({success:false,message:"Missing Details"})
    }

    // validating emIL Format
    if(!validator.isEmail(email)){
      return res.json({success:false,message:"Please enter a valid Email"})
    }

    // validating password
    if(password.length < 8){
      return res.json({success:false,message:"Password should be at least 8 characters"})
    }

    // hashing doctor password
    const salt = await bycrypt.genSalt(10)
    const hashedPassword = await bycrypt.hash(password,salt)

    // upload image for cloudinary
    const imageUpload =await cloudinary.uploader.upload(imageFile.path, {
      resource_type:"image"
    })
    const imageUrl = imageUpload.secure_url

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
      address:JSON.parse(address),
      date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({success:true,message:"Doctor Added Successfully"})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

export {addDoctor}