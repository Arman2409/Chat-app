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
    setUser: (state, action) => {
        state.user = action.payload;
        console.log(state.user);
    },
    setUserWindow: (state, action) => {
        state.userWindow = action.payload;
    }
  }
});

export const {setUserWindow} = userSlice.actions;
export default userSlice.reducer;