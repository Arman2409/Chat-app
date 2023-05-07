import { createSlice, Slice } from "@reduxjs/toolkit";
import { WindowInitialState,} from "../types/types";

const initialState:WindowInitialState = {
    loaded: false,
    menuOption: "",
    userWindow: false
}

const windowSlice:Slice = createSlice({
    name:  "windowSlice",
    initialState,
    reducers: {
        setLoaded: (state, action) => {
            state.loaded = action.payload;
        },
        setUserWindow: (state, action) => {
            state.userWindow = action.payload;
        },
        setMenuOption: (state, action) => {
            state.menuOption = action.payload;
        }
    }
});

export const { setUserWindow, setMenuOption, setLoaded } = windowSlice.actions;
export default windowSlice.reducer;