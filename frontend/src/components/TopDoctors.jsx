import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Doctors To Book</h1>
      <p className='text-sm text-center sm:w-1/3'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='grid w-full gap-4 px-3 pt-5 grid-cols-auto gap-y-6 sm:px-0 '>
        {doctors.slice(0,10).map((item, index) => (
          <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 hover:ring-2 hover:ring-blue-600' key={index}>
            <img className='bg-blue-50' src={item.image} />
            <div className='p-4'>
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? ' text-green-500' : 'text-red-500'}`}>
                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>
              <p className='text-lg font-medium text-gray-900'>{item.name}</p>
              <p className='text-sm text-gray-600'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>{ navigate('/doctors'); scrollTo(0,0)}} className='px-12 py-3 mt-10 text-gray-600 bg-blue-100 rounded-full hover:bg-primary hover:text-white hover:scale-105'>More</button>
    </div>
  )
}

export default TopDoctors
