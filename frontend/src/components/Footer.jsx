import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/*------Left------- */}
        <div>
          <img className='w-40 mb:-5' src={assets.logo} />
          <p className='w-full leading-6 text-gray-600 md:w-2/3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut cupiditate molestiae delectus nisi officiis molestias earum nam, quam quaerat distinctio autem reiciendis corporis ipsam eius commodi tenetur sunt fuga id!</p>
        </div>
        {/*------Center------- */}
        <div>
          <p className='text-xl font-medium md-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        {/*------Right------- */}
        <div>
          <p className='text-xl font-medium md-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+94760335556</li>
            <li>yashmikashashimal07603@gmail.com</li>
          </ul>
        </div>
      </div>
      {/*----Copyright ----*/}
      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ REACTJS - All Righ Reserved</p>
      </div>
    </div>
  )
}

export default Footer
