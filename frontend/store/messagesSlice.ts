import { createSlice, Slice } from "@reduxjs/toolkit";
import {MessagesInitialState,} from "../types/types";

const initialState:MessagesInitialState = {
    interlocutor: {id: "" ,name: "", email: "", image: "", friendRequests: [], sentRequests: [], friends: [], active: false},
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