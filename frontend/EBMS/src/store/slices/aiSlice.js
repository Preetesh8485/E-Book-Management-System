import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const aiSlice = createSlice({
    name:"ai",
    initialState:{
        loading:false,
        error:null,
        message:null,
        reply:null,
        profile:null,
    },
    reducers:{
        chatReq(state){
            state.loading =true;
            state.error=null;
            state.message=null;
        },
        chatSuccess(state,action){
            state.loading=false;
            state.reply=action.payload.reply;
            state.profile=action.payload.profile;
            state.message=action.payload.message || null;
        },
        chatFail(state,action){
            state.loading=false;
            state.error=action.payload;
        },
        resetAiSlice(state){
            state.error=null;
            state.loading=false;
            state.message=null;
        }
    }
})

export const resetAiSlice=()=>(dispatch)=>{
    dispatch(aiSlice.actions.resetAiSlice())
}

export const chatWithAI=(message)=>async(dispatch)=>{
    dispatch(aiSlice.actions.chatReq());
    await axios
    .post("https://e-book-management-system-rprf.onrender.com/api/ai/chat",{message},{
        withCredentials:true,
        headers:{
            "Content-Type":"application/json",
        },
    })
    .then((res)=>{
        dispatch(aiSlice.actions.chatSuccess(res.data));
    })
    .catch((error)=>{
        dispatch(aiSlice.actions.chatFail(error.response.data.message));
    })
}

export default aiSlice.reducer;