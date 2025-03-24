import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='pt-10 text-2xl text-center text-gray-500'>
        <p>ABOUT <span className='font-medium text-gray-700'>US</span></p>
      </div>
      <div className='flex flex-col gap-12 my-10 md:flex-row'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} />
        <div className='flex flex-col justify-center gap-6 text-sm text-gray-600 md:w-2/4'>
          <p>Welcome to Prescripto, Your trusted partner in managing your healthcare needs conveniently and efficiently.At Prescripto, We understand the challanges indivituals face when it comes to schrduling doctor appointment and managing their health record.</p>
          <p>Prescripto is Commited to excellence in healthcare technology.We Continuodly dtrive to enhance our flatform, Intergrating the laytest advancements to improve user experience and deliver superior service.Whether You're Booking Your first appointment or managinf ongooing care, Prescripto is here to support you every step of the day.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our Vision at Prescripto is to create a seamiess healthcare ecperience for every user.We aim to bridge the Gop between patients and healthcare providers.Making it easier for you to access the care you need,When You Need it.</p>
        </div>
      </div>
      <div className='my-4 text-xl'>
        <p>Why <span className='font-semibold text-gray-700'>CHOOSE US</span></p>
      </div>
      <div className='flex flex-col mb-20 md:flex-row'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>efficiency:</b>
          <p>Streamlined appointment scheduling that fts into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personalization:</b>
          <p>Tailored recommendation and reminders to help you dtay on top of your health.</p>
        </div>
      </div>
    </div>
  )
}

export default About
