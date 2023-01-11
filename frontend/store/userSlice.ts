import { createSlice, Slice } from "@reduxjs/toolkit";
import {  InitialState } from "../types/types";

const initialState:InitialState = {
    user: {name: "", email: "", image: ""},
    userWindow: false
}

const userSlice:Slice = createSlice({
  name:  "userSlice",
  initialState,
  reducers: {
    setStoreUser: (state, action) => {
        state.user = action.payload;
    },
    setUserWindow: (state, action) => {
        state.userWindow = action.payload;
    }
  }
});

export const {setUserWindow, setStoreUser} = userSlice.actions;
export default userSlice.reducer;