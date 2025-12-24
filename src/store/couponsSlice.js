import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchCouponsThunk = createAsyncThunk('fetchCoupons/fetchCouponsThunk', async (payload) => {
    const response = await networkCall('fetchCoupons', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const createCouponThunk = createAsyncThunk('createCoupon/createCouponThunk', async (payload) => {
    const response = await networkCall('createCoupon', payload)
    try {
        if (response.status === 1) {
            return response;
        }
    } catch (error) {
        console.log(error);
    }
    throw response.message;
});

export const deleteCouponThunk = createAsyncThunk('deleteCoupon/deleteCouponThunk', async (payload) => {
    const response = await networkCall('deleteCoupon', payload)
    try {
        if (response.status === 1) {
            return payload;
        }
    } catch (error) {
        console.log(error);
    }
    throw response.message;
});
const couponsSlice = createSlice({
    name: 'coupons',
    initialState: {
        isLoading: false,
        data: [],
        pageCount: null,
        status: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCouponsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
                state.status = null
            })
            .addCase(fetchCouponsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.coupons
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchCouponsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
        builder
            .addCase(createCouponThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.status = null
            })
            .addCase(createCouponThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload.status)
                state.status = action.payload.status; // Correctly setting status
                toast.success(action.payload.data.message || 'Coupon created successfully');
                state.error = null;
            })
            .addCase(createCouponThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            builder
            .addCase(deleteCouponThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.status = null
            })
            .addCase(deleteCouponThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter((coupon) => coupon._id !== action.payload.couponId);
                toast.success('Coupon deleted successfully');
                state.error = null;
            })
            .addCase(deleteCouponThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default couponsSlice.reducer;