import { createSlice, Slice } from "@reduxjs/toolkit";
import {MessagesInitialState, UserInitialState} from "../types/types";

const initialState:MessagesInitialState = {
    interlocutor: {id: 0,name: "", email: "", image: "", friendRequests: [], friends: [], active: false},
    messagesData: { between: [], sequence: [], messages: []}
}

const messagesSlice:Slice = createSlice({
    name:  "messagesSlice",
    initialState,
    reducers: {
        setInterlocutor: (state, action) => {
            state.interlocutor = action.payload;
        },
        setMessagesData: (state, action) => {
           state.messagesData = action.payload;
        },
    }
});

export const { setInterlocutor, setMessagesData } = messagesSlice.actions;
export default messagesSlice.reducer;