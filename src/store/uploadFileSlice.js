import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosNetworkCall } from "../api/Network";

export const uploadFileThunk = createAsyncThunk('uploadFile/uploadFileThunk', async (payload) => {
    const response = await axiosNetworkCall('uploadFile', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const uploadFileSlice = createSlice({
    name: 'file',
    initialState: {
        isLoading: false,
        data: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadFileThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
            })
            .addCase(uploadFileThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(uploadFileThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default uploadFileSlice.reducer;