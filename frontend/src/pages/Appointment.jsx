import React, { useContext, useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets' // Add this import
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo,setDocInfo] = useState(null)
  const [docSlots,setDocSlot] = useState([])
  const [slotIndex,setSlotIndex] = useState(0)
  const [slotTime,setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlot = async () => {
    if (!docInfo) return; // Ensure docInfo is defined // it not sure check

    setDocSlot([])

    // getting current date
    let today = new Date()

    for(let i = 0; i < 7; i++){
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() +i)
      
      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() +i)
      endTime.setHours(21,0,0,0)

      // setting hours
      if(today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while(currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day+"_"+month+"_"+year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false: true

        if (isSlotAvailable) {
          
          // add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        }

        //increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlot(prev => ([...prev, timeSlots]))

    }
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day +"_" + month + "_" + year

      const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers:{token}})

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=>{
   getAvailableSlot() 
  },[docInfo])

  useEffect(()=> {
    console.log(docSlots);
  },[docSlots])

  return docInfo && (
    <div>
      {/*------Doctor details-----*/}
      <div className='flex flex-col gap-10 sm:flex-row'>
        <div>
          <img className='w-full rounded-lg bg-primary sm:max-w-72' src={docInfo.image} />
        </div>
        <div className='flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-[-80px] sm:mt-0'>
          {/*----- Doc Info : name, degree, experience-----*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} />
          </p>
          <div className='flex items-center gap-2 mt-1 text-sm text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
         {/*------ Doctor about-------*/}
          <div>
            <p className='flex items-center gap-1 mt-3 text-sm font-medium text-gray-900'>About <img src={assets.info_icon} /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='mt-4 font-medium text-gray-500'>
            Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
          <div className={`flex items-center gap-2 text-sm text-center ${docInfo.available ? ' text-green-500' : 'text-red-500'}`}>
                <p className={`w-2 h-2 ${docInfo.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{docInfo.available ? 'Available' : 'Not Available'}</p>
              </div>
        </div>
      </div>
      {/*----- booking slots -----*/}
      <div className='font-medium text-gray-700 sm:ml-72 sm:pl-4'>
        <p>Booking Slots</p>
        <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
          {
            docSlots.length && docSlots.map((item,index)=> (
              <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center w-full gap-3 mt-4 overflow-x-scroll'>
        {docSlots.length && docSlots[slotIndex].map((item,index)=> (
          <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
            {item.time.toLowerCase()}
          </p>
        ))}
        </div>
        <button onClick={bookAppointment} className='py-3 my-6 text-sm font-light text-white rounded-full bg-primary px-14'>Book an Appointment</button>
      </div>
      {/*---- Listing Related Doctors----*/}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment
