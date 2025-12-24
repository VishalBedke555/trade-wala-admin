import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchDeliveriesThunk = createAsyncThunk('fetchDeliveries/fetchDeliveriesThunk', async (payload) => {
    const response = await networkCall('fetchDeliveries', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const deliveriesSlice = createSlice({
    name: 'deliveries',
    initialState: {
        isLoading: false,
        data: [],
        pageCount: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveriesThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
            })
            .addCase(fetchDeliveriesThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.deliveries
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchDeliveriesThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default deliveriesSlice.reducer;