import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

  const {aToken,setAToken} = useContext(AdminContext)
  const {dToken, setDToken} = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-b sm:px-10'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='cursor-pointer w-60 sm:w-44' src={assets.admin_logo} />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={logout} className='px-6 py-2 text-sm bg-white rounded-full text-primary ring-1 ring-primary hover:bg-primary hover:text-white hover:scale-105'>Logout</button>
    </div>
  )
}

export default Navbar
