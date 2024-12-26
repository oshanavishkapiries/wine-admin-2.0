import {createSlice} from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("userInfo");
const initialState = {
    userInfo: userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null,
    token: localStorage.getItem("authToken") || null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const {userInfo, token} = action.payload || {};
           
            if (userInfo && token) {
                localStorage.setItem("authToken", token);
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                state.userInfo = userInfo;
                state.token = token;
            }
        },
        clearUser: (state) => {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("authToken");
            state.userInfo = null;
            state.token = null;
        },
    },
});

export const {setUser, clearUser} = authSlice.actions;

export default authSlice.reducer;
