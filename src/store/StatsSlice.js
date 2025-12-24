import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchStatsThunk = createAsyncThunk('fetchStats/fetchStatsThunk', async (payload) => {
    const response = await networkCall('fetchStats', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        isLoading: false,
        data: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
                state.pageCount = null
            })
            .addCase(fetchStatsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchStatsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default statsSlice.reducer;