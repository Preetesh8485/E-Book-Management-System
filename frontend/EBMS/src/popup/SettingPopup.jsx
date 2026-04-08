import React, { useState } from 'react'
import closeIcon from "../assets/close-square.png";
import{ useDispatch, useSelector} from "react-redux"
import{updatePassword}from "../store/slices/authSlice"
import settingIcon from "../assets/setting.png"
import { toggleSettingPopup } from '../store/slices/popupSlice';
const SettingPopup = () => {
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmNewPassword,setConfirmPassword]=useState("");
  const dispatch = useDispatch();
  const{loading}=useSelector((state)=>state.auth);
  const handleUpdatePassword =(e)=>{
    e.preventDefault();
    const data=new FormData();
    data.append("currentPassword",currentPassword);
    data.append("newPassword",newPassword);
    data.append("confirmNewPassword",confirmNewPassword);
    dispatch(updatePassword(data));
  }
  

  return (
    <div className="fixed inset-0 bg-black/50  p-5 flex items-center justify-center z-50">
          <div className="w-full bg-white rounded-lg shadow-lg sm:w-auto lg:w-1/2 2xl:w-1/3">
            <div className="p-6">
              <header className="flex justify-between items-center mb-7 pb-5 border-b border-black">
                <div>
                  <img src={settingIcon} alt="setting-icon"  />
                  <h3>Change credentails</h3>
                </div>
                <img src={closeIcon} alt="close-icon" className='cursor-pointer' onClick={() => dispatch(toggleSettingPopup())} />
              </header>
              <form onSubmit={handleUpdatePassword}>
                <div className="mb-4 sm:flex gap-4 items-center">
                   <label className="block text-gray-900 font-medium w-full">Current Password</label>
                   <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} placeholder="Current Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
                </div>
                <div className="mb-4 sm:flex gap-4 items-center">
                   <label className="block text-gray-900 font-medium w-full">New Password</label>
                   <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder="New Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
                </div>
                <div className="mb-4 sm:flex gap-4 items-center">
                   <label className="block text-gray-900 font-medium w-full">Confirm Password</label>
                   <input type="password" value={confirmNewPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
                </div>
                <div className="flex gap-4 mt-10">
                 <div className="flex justify-center space-x-4">
                  <button type="button" onClick={()=>{dispatch(toggleSettingPopup())}} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                   CANCEL
                  </button>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white hover:bg-gray-600 rounded-md ">
                    CONFIRM
                  </button>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
  )
}

export default SettingPopup
