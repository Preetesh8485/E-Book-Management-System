import React, { useState } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popupSlice";
import Cropper from "react-easy-crop";
import { useEffect } from "react";
const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [regdno, setRegdno] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setShowCropper(true); // open cropper
  };
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(t);
  }, []);
  const handleNewAdmin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("avatar", avatar);
    data.append("regdno", regdno);
    dispatch(addNewAdmin(data))
  };
  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => {
      dispatch(toggleAddNewAdminPopup());
    }, 300);
  };
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = Math.min(crop.width, crop.height);

    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  };

  const handleCrop = async () => {
    const croppedBlob = await getCroppedImg(image, croppedAreaPixels);

    const previewUrl = URL.createObjectURL(croppedBlob);

    setAvatar(croppedBlob);
    setAvatarPreview(previewUrl);

    setShowCropper(false);
  };

  return <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔥 Background blur */}
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>
      <div
        className={`w-full bg-white rounded-lg shadow-lg md:w-1/3 relative transform transition-all duration-300 ${animate ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
      >
        <div className="p-6">
          <header className="flex justify-between items-center mb-7 pb-5 border-b border-black">
            <div>
              <img src={keyIcon} alt="key-icon" />
              <h3>Add new admin</h3>
            </div>
            <img src={closeIcon} alt="close-icon" onClick={handleClose} />
          </header>
          <form onSubmit={handleNewAdmin}>
            {/*avatar selection*/}
            <div className="flex items-center flex-col mb-6">
              <label htmlFor="avatarInput" className="cursor-pointer" ><img src={avatarPreview ? avatarPreview : placeHolder} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                <input type="file" id="avatarInput" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Admin Full name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin valid Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Regdno</label>
              <input type="number" value={regdno} onChange={(e) => setRegdno(e.target.value)} placeholder="Admin redgno" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin entry password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-black" />
            </div>

            <div className="flex justify-center space-x-4">
              <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                CLOSE
              </button>
              <button
                type="submit"
                disabled={
                  loading || !name || !email || !password || !regdno || !avatar
                }
                className="px-4 py-2 bg-black text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ADDING...
                  </>
                ) : (
                  "ADD"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    {showCropper && (
      <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg w-[90%] max-w-sm">

          <div className="relative w-full h-64">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full mt-3"
          />

          <div className="flex justify-between mt-3">
            <button onClick={() => setShowCropper(false)}>
              Cancel
            </button>

            <button onClick={handleCrop}>
              Crop
            </button>
          </div>

        </div>
      </div>
    )}
  </>;
};

export default AddNewAdmin;
