import { createSlice, Slice } from "@reduxjs/toolkit";
import { SocketInitialState } from "../types/types";

const initialState:SocketInitialState = {
    socket: null
}

const socketSlice:Slice = createSlice({
    name:  "socketSlice",
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        }
    }
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;