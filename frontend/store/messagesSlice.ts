import { createSlice, Slice } from "@reduxjs/toolkit";
import { MessagesInitialState,} from "../types/types";

const initialState:MessagesInitialState = {
    interlocutor: {id: "" ,name: "", email: "", image: "", friendRequests: [], sentRequests: [], friends: [], active: false},
    messagesData: { between: [],  messages: []},
    interlocutorMessages:  { between: [],  messages: []},
    notSeenCount: 0,
}

const messagesSlice:Slice = createSlice({
    name:  "messagesSlice",
    initialState,
    reducers: {
        setInterlocutor: (state, action) => {
            state.interlocutor = action.payload;
        },
        setInterlocutorMessages: (state, action) => {
            state.interlocutorMessages = action.payload;
        },
        setMessagesData: (state, action) => {
           state.messagesData = action.payload;
        },
        setNotSeenCount: (state, action) => {
            state.notSeenCount = action.payload;
        },
    }
});

export const { setInterlocutor, setNotSeenCount, setInterlocutorMessages, setMessagesData } = messagesSlice.actions;
export default messagesSlice.reducer;