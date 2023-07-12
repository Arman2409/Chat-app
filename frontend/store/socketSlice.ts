import { createSlice, Slice } from "@reduxjs/toolkit";

import type { SocketInitialState } from "../types/storeTypes";

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