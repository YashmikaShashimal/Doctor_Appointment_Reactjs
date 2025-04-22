import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'


const AllApointments = () => {

  const {aToken, appointments, getAllAppointments, cancelAppointment} = useContext(AdminContext)
  const {calculateAge, slotDateFormat, currency} = useContext(AppContext)

  useEffect(() => {

    if (aToken) {
    getAllAppointments()
    }
  },[aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointment</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll min-h-[60vh]'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 bottom-6 border-b text-zinc-500'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.slice().reverse().map((item, index) => {
          const reversedIndex = appointments.length - index; // Adjust index for reversed order
          return (
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{reversedIndex}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} alt="" className='w-8 rounded-full' /> <p>{item.userData.name}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p className='max-sm:hidden'>{slotDateFormat(item.slotDate)} , {item.slotTime}</p>
              <div className='flex items-center gap-2'>
                <img src={item.docData.image} alt="" className='w-8 bg-gray-200 rounded-full' /> <p>{item.docData.name}</p>
              </div>
              <p>{currency}{item.amount}</p>
              {
              item.cancelled
              ? <p className='text-sm font-medium text-red-400'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-sm font-medium text-green-500'>Completed</p>
                : <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} />
              }
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default AllApointments
