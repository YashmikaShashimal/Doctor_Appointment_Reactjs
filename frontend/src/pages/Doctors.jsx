import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [ filterDoc, setFilterDoc ] = useState([])
  const [showFilter,setShowFilter] = useState(false)
  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }
  
  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col items-start gap-5 mt-5 sm:flex-row'>
      <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "General physician" ? "bg-indigo-50 text-primary" : ""}`}>General physician</p>
          <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "Gynecologist" ? "bg-indigo-50 text-primary" : ""} ${speciality === "" ? "bg-indigo-50 text-primary" : ""}`}>Gynecologist</p>
          <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "Dermatologist" ? "bg-indigo-50 text-primary" : ""}`}>Dermatologist</p>
          <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "Pediatricians" ? "bg-indigo-50 text-primary" : ""}`}>Pediatricians</p>
          <p onClick={()=> speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "Neurologist" ? "bg-indigo-50 text-primary" : ""}`}>Neurologist</p>
          <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:ring-1 hover:ring-blue-600 hover:text-primary ${speciality === "Gastroenterologist" ? "bg-indigo-50 text-primary" : ""}`}>Gastroenterologist</p>
        </div>
        <div className='grid w-full gap-4 grid-cols-auto gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 hover:ring-1 hover:ring-blue-600' key={index}>
                <img className='bg-blue-50' src={item.image} />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? ' text-green-500' : 'text-red-500'}`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-lg font-medium text-gray-900'>{item.name}</p>
                  <p className='text-sm text-gray-600'>{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
