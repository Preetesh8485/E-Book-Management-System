import { createSlice } from "@reduxjs/toolkit";
const popupSlice=createSlice({
    name:"popup",
    initialState:{
        settingPopup:false,
        addBookPopup:false,
        readBookPopup:false,
        recordPopup:false,
        returnPopup:false,
        addNewAdminPopup:false,
        OrderBookPopup:false,
    },
    reducers:{
        toggleSettingPopup(state){
            state.settingPopup=!state.settingPopup;
        },
        toggleAddBookPopup(state){
            state.addBookPopup=!state.addBookPopup;
        },
        toggleReadBookPopup(state){
            state.readBookPopup=!state.readBookPopup;
        },
        toggleRecordBookPopup(state){
            state.recordPopup=!state.recordPopup;
        },
        toggleReturnBookPopup(state){
            state.returnPopup=!state.returnPopup;
        },
        toggleAddNewAdminPopup(state){
            state.addNewAdminPopup=!state.addNewAdminPopup;
        },
        toggleOrderBookPopup(state){
            state.OrderBookPopup=!state.OrderBookPopup;
        },
        CloseAllPopup(state){
            state.settingPopup=false;
            state.addBookPopup=false;
            state.readBookPopup=false;
            state.recordPopup=false;
            state.returnPopup=false;
            state.addNewAdminPopup=false;
            state.OrderBookPopup=false;
        },

    }
})

export const {CloseAllPopup,toggleAddBookPopup,toggleAddNewAdminPopup,toggleOrderBookPopup,toggleReadBookPopup,toggleRecordBookPopup,toggleReturnBookPopup,toggleSettingPopup} = popupSlice.actions;
export default popupSlice.reducer;