import { createSlice } from "@reduxjs/toolkit"

const userInitialState = {
    userData: null,
}

const userSlice = createSlice({
    name : 'user',
    initialState: userInitialState,
    reducers: {
        setUserData(state, action){
            state.userData = action.payload.userData;
        },
    }
})

export const userSliceActions = userSlice.actions;

export default userSlice.reducer;