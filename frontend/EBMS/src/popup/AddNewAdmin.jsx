import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch,useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popupSlice";

const AddNewAdmin = () => {
  const dispatch=useDispatch();
  const{loading}=useSelector(state=>state.user);
  const[name,setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[avatar,setAvatar]=useState(null);
  const[avatarPreview, setAvatarPreview]=useState(null);
  const[regdno,setRegdno]=useState("");
  const handleImageChange=(e)=>{};
  const handleNewAdmin=(e)=>{
    e.preventDefault();
    const data = new FormData();
    data.append("name",name);
    data.append("email",email);
    data.append("password",password);
    data.append("avatar",avatar);
    data.append("regdno",regdno);
    dispatch(addNewAdmin(data))
  };
  return <>
  <h1 className="fixed inset-0 bg-black/50  p-5 flex items-center justify-center z-50">
  <div className="w-full bg-white rounded-lg shadow-lg md:w-1/3">
    <div className="p-6">
      <header className="flex justify-between items-center mb-7 pb-5 border-b border-black">
        <div>
          <img src={keyIcon} alt="key-icon" />
          <h3>Add new admin</h3>
        </div>
        <img src={closeIcon} alt="close-icon" onClick={()=>dispatch(toggleAddNewAdminPopup())} />
      </header>
    </div>
  </div>
  </h1>
  </>;
};

export default AddNewAdmin;
