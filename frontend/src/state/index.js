import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setCarteiras: (state, action) => {
            if (state.user) {
                state.user.carteira = action.payload.carteira;
            } else {
                console.error("user carteira non-existent :(")
            }
        },
    }
})

export const { setMode, setLogin, setLogout, setCarteiras } = authSlice.actions;
export default authSlice.reducer;