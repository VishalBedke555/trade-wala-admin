import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchPaymentsThunk = createAsyncThunk('fetchPayments/ffetchPaymentsThunk', async (payload) => {
    const response = await networkCall('fetchPayments', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const settlePaymentThunk = createAsyncThunk('settlePayment/settlePaymentThunk', async (payload) => {
    const response = await networkCall('settlePayment', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchPaymentDetailsThunk = createAsyncThunk('fetchPaymentDetails/fetchPaymentDetailsThunk', async (payload) => {
    const response = await networkCall('fetchPaymentDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updatePaymentDetailsThunk = createAsyncThunk('updatePaymentDetails/updatePaymentDetailsThunk', async (payload) => {
    const response = await networkCall('updatePaymentDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const paymentsSlice = createSlice({
    name: 'payments',
    initialState: {
        isLoading: false,
        data: [],
        pageCount: null,
        paymentDetails: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
            })
            .addCase(fetchPaymentsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.payments
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchPaymentsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(settlePaymentThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(settlePaymentThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("Payment settled successfully");

                // Update the payment status in the list
                const updatedPayments = state.data.map((payment) =>
                    payment._id === action.payload.paymentId // FIXED: Use `_id` from API response
                        ? { ...payment, status: action.payload.status }
                        : payment
                );

                state.data = updatedPayments;
                state.error = null;
            })
            .addCase(settlePaymentThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            .addCase(fetchPaymentDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.paymentDetails = []
            })
            .addCase(fetchPaymentDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.paymentDetails = action.payload
                state.error = null
            })
            .addCase(fetchPaymentDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            .addCase(updatePaymentDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.paymentDetails = []
            })
            .addCase(updatePaymentDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.paymentDetails = action.payload
                toast.success("Payment Details Updated Successfully")
                state.error = null
            })
            .addCase(updatePaymentDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default paymentsSlice.reducer;