import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchCustomerSupportDetailsThunk = createAsyncThunk('fetchCustomerSupportDetails/fetchCustomerSupportDetailsThunk', async (payload) => {
    const response = await networkCall('fetchCustomerSupportDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateCustomerSupportDetailsThunk = createAsyncThunk('updateCustomerSupportDetails/updateCustomerSupportDetailsThunk', async (payload) => {
    const response = await networkCall('updateCustomerSupportDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const customerSupportSlice = createSlice({
    name: 'customerSupport',
    initialState: {
        isLoading: false,
        data: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerSupportDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
            })
            .addCase(fetchCustomerSupportDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchCustomerSupportDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            });
        builder
            .addCase(updateCustomerSupportDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateCustomerSupportDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                toast.success("Customer Support Contact Updated Successfully!")
                state.error = null
            })
            .addCase(updateCustomerSupportDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default customerSupportSlice.reducer;