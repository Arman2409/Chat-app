import { configureStore, Store} from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import messagesSlice from "./messagesSlice";
import {Reducers} from "../types/types";
import socketSlice from "./socketSlice";

const reducers:Reducers = {
    user: userReducer,
    messages: messagesSlice,
    socket: socketSlice,
}

const store:Store = configureStore({
    reducer:reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false}),
})

export default store;
export type IRootState = ReturnType<typeof store.getState>; 