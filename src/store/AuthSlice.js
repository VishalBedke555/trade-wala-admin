import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import networkCall from "../api/Network";
import { toast } from "react-toastify";

export const loginUserThunk = createAsyncThunk('signIn/signInUserThunk', async (credentials)=>{
    const response = await networkCall('signIn', credentials);
    try {
        if (response.status == 1){
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }   
    throw response.message;
});

const authSlice = createSlice({
    name:'auth',
    initialState: {
        isLoading : false,
        error: null,
        isLoggedIn: false
    },
    reducers:{ },
    extraReducers: (builder)  =>{
        builder
        .addCase(loginUserThunk.pending, (state,action)=>{
            state.isLoggedIn = false
            state.isLoading= true
            state.error = null
        })
        .addCase(loginUserThunk.fulfilled, (state,action)=>{
            state.isLoading= false
            state.isLoggedIn = true
            state.error = null
            window.localStorage.setItem('token',action.payload.token)
            toast.success("Login Success")
        })
        .addCase(loginUserThunk.rejected, (state, action)=>{
           state.isLoggedIn = false
            state.isLoading = false
            state.error = `${action.error?.message || 'Somthing went Wrong'}`
            toast.error(state.error)
        })
    }
})

export default authSlice.reducer;