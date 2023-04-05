import { createSlice, Slice } from "@reduxjs/toolkit";
import {  UserInitialState } from "../types/types";

const initialState:UserInitialState = {
    user: {id: "", name: "", email: "", sentRequests: [], image: "", friendRequests: [], friends: [], active: false},
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