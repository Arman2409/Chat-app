import { configureStore, Reducer, Store} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import messagesSlice from "./messagesSlice";
import {Reducers} from "../types/types";

const reducers:Reducers = {
    user: userReducer,
    messages: messagesSlice
}

const store:Store = configureStore({
    reducer:reducers
})

export default store;
export type IRootState = ReturnType<typeof store.getState>; 