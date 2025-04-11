import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userController.js';
// paymentPaypal, verifyPaypal
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile', upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
//userRouter.post('/payment-paypal',authUser,paymentPaypal)
//userRouter.post('/verify-razorpay',authUser,verifyPaypal)


export default userRouter