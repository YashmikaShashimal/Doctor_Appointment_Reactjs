import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false)
  const [token, setToken] = useState(true)

  return (
    <div className='flex items-center justify-between py-4 mb-5 text-sm border-b border-b-gray-400'>
      <img onClick={()=>navigate('/')} className='cursor-pointer w-44' src={assets.logo} alt='' />
      <ul className='items-start hidden gap-5 font-medium md:flex'>
        <NavLink to='/'>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors'>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about'>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact'>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {
          token
          ? <div className='relative flex items-center gap-2 cursor-pointer group'>
              <img className='w-8 rounded-full' src={assets.profile_pic} />
              <img className='w-2.5' src={assets.dropdown_icon} />
              <div className='absolute top-0 right-0 z-20 hidden text-base font-medium text-gray-600 pt-14 group-hover:block'>
                <div className='flex flex-col gap-4 p-4 rounded min-w-48 bg-stone-100'>
                  <p onClick={()=>navigate('my-profile')} className='cursor-pointer hover:text-black'>My profile</p>
                  <p onClick={()=>navigate('my-appointments')} className='cursor-pointer hover:text-black'>My Appointment</p>
                  <p onClick={()=>setToken(false)} className='cursor-pointer hover:text-black'>Logout</p>
                </div>
              </div>
            </div>
          :<button onClick={()=>navigate('/login')} className='hidden px-8 py-3 font-light text-white rounded-full bg-primary md:block'>Create Account</button>
        }  
      </div>
    </div>
  )
}

export default Navbar
