import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  },[dToken])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105 hover:ring-2 hover:ring-primary'>
          <img className='w-14' src={assets.earning_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400 hover:text-primary'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105 hover:ring-2 hover:ring-primary'>
          <img className='w-14' src={assets.appointment_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patient}</p>
            <p className='text-gray-400 hover:text-primary'>Patient</p>
          </div>
        </div>
        <div className='flex items-center gap-2 p-4 transition-all bg-white border-2 border-gray-100 rounded cursor-pointer min-w-52 hover:scale-105 hover:ring-2 hover:ring-primary'>
          <img className='w-14' src={assets.patients_icon} />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
            <p className='text-gray-400 hover:text-primary'>Patient</p>
          </div>
        </div>
      </div>
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {
            dashData.latestAppointments.map((item, index) => (
              <div className='flex items-center gap-3 px-6 py-3 hover:bg-gray-100' key={index}>
              <img className='w-10 rounded-full' src={item.userData.image} />
                <div className='flex-1 text-sm'>
                  <p className='font-medium text-gray-800'>{item.userData.name}</p>
                  <p className='text-gray-600'>{slotDateFormat(item.slotDate)}</p>
                </div>
                 {
                  item.cancelled 
                  ? <p className='text-xs font-medium text-red-400'>cancelled</p>
                  : item.isCompleted
                    ? <p className='text-xs font-medium text-green-500'>Completed</p>
                    : <div className='flex'>
                        <img onClick={()=>cancelAppointment(item._id)} className='w-10 cursor-pointer hover:scale-105' src={assets.cancel_icon} />
                        <img onClick={async () => {
                          await completeAppointment(item._id);
                          getDashData(); // Refresh dashboard data after completing an appointment
                        }} className='w-10 cursor-pointer hover:scale-105' src={assets.tick_icon} />
                      </div>
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
