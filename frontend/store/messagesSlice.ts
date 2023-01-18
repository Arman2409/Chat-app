import { createSlice, Slice } from "@reduxjs/toolkit";
import {MessagesInitialState, UserInitialState} from "../types/types";

const initialState:MessagesInitialState = {
    interlocutor: {id: 0,name: "", email: "", image: "", friendRequests: [], friends: [], active: false},
}

const messagesSlice:Slice = createSlice({
    name:  "messagesSlice",
    initialState,
    reducers: {
        setInterlocutor: (state, action) => {
            state.interlocutor = action.payload;
        }
    }
});

export const { setInterlocutor } = messagesSlice.actions;
export default messagesSlice.reducer;