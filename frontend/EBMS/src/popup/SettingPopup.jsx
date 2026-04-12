import React, { useState, useEffect } from 'react'
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux"
import { updatePassword } from "../store/slices/authSlice"
import settingIcon from "../assets/setting.png"
import { toggleSettingPopup } from '../store/slices/popupSlice';

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  
  // Three separate states to toggle visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const timeout = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      dispatch(toggleSettingPopup());
    }, 300);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    data.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(data));
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ${isOpen ? "bg-black/40 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"}`}>
      
      <div className={`w-[95%] max-w-lg bg-white rounded-2xl shadow-2xl transition-all duration-500 transform ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        
        <div className="p-6 md:p-8">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={settingIcon} alt="setting-icon" className="w-6 h-6" />
              <h3 className="text-xl font-bold text-gray-800">Change Credentials</h3>
            </div>
            <button onClick={handleClose}>
              <img src={closeIcon} alt="close-icon" className="w-8 h-8" />
            </button>
          </header>

          <form onSubmit={handleUpdatePassword} className="space-y-5">
            
            {/* Field 1: Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  placeholder="Current Password" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500"
                >
                  {showCurrent ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Field 2: New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="New Password" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500"
                >
                  {showNew ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Field 3: Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm Password" 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500"
                >
                  {showConfirm ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={handleClose} className="px-6 py-2.5 font-semibold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-200 transition-colors">
                CANCEL
              </button>
              <button type="submit" disabled={loading} className="px-8 py-2.5 font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:bg-gray-400">
                {loading ? "UPDATING..." : "CONFIRM"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingPopup