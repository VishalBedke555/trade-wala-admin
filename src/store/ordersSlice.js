import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchOrdersThunk = createAsyncThunk('fetchOrders/fetchOrdersThunk', async (payload) => {
    const response = await networkCall('fetchOrders', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchOrderDetailsThunk = createAsyncThunk('fetchOrderDetails/fetchOrderDetailsThunk', async (payload) => {
    const response = await networkCall('fetchOrderDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        isLoading: false,
        data: [],
        orderDetails: null,
        pageCount: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrdersThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
            })
            .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.orders
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchOrdersThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
            builder
            .addCase(fetchOrderDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.orderDetails = null
            })
            .addCase(fetchOrderDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.orderDetails = action.payload
                state.error = null
            })
            .addCase(fetchOrderDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default ordersSlice.reducer;