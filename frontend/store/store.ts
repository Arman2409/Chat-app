import { configureStore, Reducer, Store} from "@reduxjs/toolkit";
import userReducer from "./userSlice";

interface Reducers {
    user: Reducer
};

const reducers:Reducers = {
    user: userReducer,
}

const store:Store = configureStore({
    reducer:reducers
})

export default store;
export type IRootState = ReturnType<typeof store.getState>; 