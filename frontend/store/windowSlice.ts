import { createSlice, Slice } from "@reduxjs/toolkit";
import { WindowInitialState,} from "../types/types";

const initialState:WindowInitialState = {
    loaded: false,
}

const windowSlice:Slice = createSlice({
    name:  "windowSlice",
    initialState,
    reducers: {
        setLoaded: (state, action) => {
            state.loaded = action.payload;
        },
    }
});

export const { setLoaded } = windowSlice.actions;
export default windowSlice.reducer;