import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {

  const navigate = useNavigate();

  const {token, setToken, userData} = useContext(AppContext)

  const [showMenu, setShowMenu] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

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
          token && userData ? (
            <div className='relative flex items-center gap-2 cursor-pointer' onClick={() => setShowDropdown(!showDropdown)}>
              <img className='w-8 rounded-full' src={userData.image} />
              <img className='w-2.5' src={assets.dropdown_icon} />
              {showDropdown && (
                <div className='absolute top-0 right-0 z-20 text-base font-medium text-gray-600 pt-14'>
                  <div className='flex flex-col gap-4 p-4 rounded min-w-48 bg-stone-100'>
                    <p onClick={() => navigate('my-profile')} className='cursor-pointer hover:text-black'>My profile</p>
                    <p onClick={() => navigate('my-appointments')} className='cursor-pointer hover:text-black'>My Appointment</p>
                    <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='hidden px-8 py-3 font-light text-white rounded-full bg-primary md:block'
            >
              Create Account
            </button>
          )
        }
        {!token && (
          <button
            onClick={() => navigate('/login')}
            className='px-4 py-2 text-sm font-light text-white transition-colors bg-blue-600 border border-blue-600 rounded-full md:hidden hover:bg-white hover:text-blue-600'
          >
            Sign In
          </button>
        )}
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} />
      </div>
      {/*---- Mobile menu ----*/}
      <div className={`fixed top-0 right-0 bottom-0 z-20 bg-white transition-all ${showMenu ? 'w-full' : 'w-0 overflow-hidden'}`}>
        <div className='flex items-center justify-between px-5 py-6 border-b'>
          <img className='w-36' src={assets.logo} alt='Logo' />
          <img className='cursor-pointer w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt='Close' />
        </div>
        <ul className='flex flex-col items-center gap-4 mt-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to='/'>
            <li className='px-4 py-2 transition-colors rounded-full hover:bg-gray-100 hover:text-primary'>Home</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'>
            <li className='px-4 py-2 transition-colors rounded-full hover:bg-gray-100 hover:text-primary'>All Doctors</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'>
            <li className='px-4 py-2 transition-colors rounded-full hover:bg-gray-100 hover:text-primary'>About</li>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'>
            <li className='px-4 py-2 transition-colors rounded-full hover:bg-gray-100 hover:text-primary'>Contact</li>
          </NavLink>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
