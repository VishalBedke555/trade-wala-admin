import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchApprovalsThunk = createAsyncThunk('fetchApprovals/fetchApprovalsThunk', async (payload) => {
    const response = await networkCall('fetchDealers', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateCompanyApprovalStatusThunk = createAsyncThunk('updateCompanyApprovalStatus/updateCompanyApprovalStatusThunk', async (payload) => {
    const response = await networkCall('updateCompanyApprovalStatus', payload)
    try {
        if (response.status == 1) {
            return payload;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchDealerSupplieProductsThunk = createAsyncThunk('fetchDealerSupplieProducts/fetchDealerSupplieProductsThunk', async (payload) => {
    const response = await networkCall('fetchDealerSupplieProducts', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchSupplieProductDetailsThunk = createAsyncThunk('fetchSupplieProductDetails/fetchSupplieProductDetailsThunk', async (payload) => {
    const response = await networkCall('fetchProductDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchDealerStatsThunk = createAsyncThunk('fetchDealerStats/fetchDealerStatsThunk', async (payload) => {
    const response = await networkCall('fetchDealerStats', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateProductListingThunk = createAsyncThunk('updateProductListing/updateProductListingThunk', async (payload) => {
    const response = await networkCall('updateProductListing', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateProductBlockingThunk = createAsyncThunk('updateProductBlocking/updateProductBlockingThunk', async (payload) => {
    const response = await networkCall('updateProductBlocking', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchDealerDetailsThunk = createAsyncThunk('fetchDealerDetails/fetchDealerDetailsThunk', async (payload) => {
    const response = await networkCall('fetchDealerDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateSupplieProductThunk = createAsyncThunk('updateSupplieProduct/updateSupplieProductThunk', async (payload) => {
    const response = await networkCall('updateSupplieProduct', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const approvalsSlice = createSlice({
    name: 'approvals',
    initialState: {
        isLoading: false,
        data: [],
        dealerData: null,
        pageCount: null,
        productsData: [],
        productDetails: null,
        stats: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovalsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
            })
            .addCase(fetchApprovalsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.approvels
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchApprovalsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(updateCompanyApprovalStatusThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateCompanyApprovalStatusThunk.fulfilled, (state, action) => {
                state.isLoading = false;

                // Remove the approved or rejected dealer from the array
                state.data = state.data.filter((approveData) => approveData._id !== action.payload.dealerId);

                // Show success toast based on approval status
                toast.success(action.payload.approved ? "Approved successfully!" : "Rejected successfully!");

                state.error = null;
            })
            .addCase(updateCompanyApprovalStatusThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(fetchDealerSupplieProductsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.productsData = []
                state.pageCount = null
            })
            .addCase(fetchDealerSupplieProductsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.productsData = action.payload.products
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchDealerSupplieProductsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            builder
            .addCase(fetchSupplieProductDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchSupplieProductDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.productDetails = action.payload
                state.error = null
            })
            .addCase(fetchSupplieProductDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            builder
            .addCase(updateSupplieProductThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSupplieProductThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("Supplie Product updated successfully");
        
                const updatedProduct = action.payload; // Updated product data
        
                // Ensure productsData exists before updating
                if (Array.isArray(state.productsData)) {
                    state.productsData = state.productsData.map(product =>
                        product._id === updatedProduct._id ? updatedProduct : product
                    );
                }
        
                state.error = null;
            })
            .addCase(updateSupplieProductThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
            

        builder
            .addCase(fetchDealerStatsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.stats = null
            })
            .addCase(fetchDealerStatsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.stats = action.payload
                state.error = null
            })
            .addCase(fetchDealerStatsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(updateProductListingThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProductListingThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("Supplies Top List Updated Successfully!");

                // Find and update the product in productsData
                const filteredData = JSON.parse(JSON.stringify(state.productsData))

                console.log(filteredData)   
                state.productsData = filteredData.map(product =>
                    product._id === action.payload._id ? action.payload : product
                );

                state.error = null;
            })
            .addCase(updateProductListingThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(updateProductBlockingThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateProductBlockingThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("Supplies Block Updated Successfully");

                // Find and update the product in productsData
                state.productsData = state.productsData.map(product =>
                    product._id === action.payload._id ? action.payload : product
                );

                state.error = null;
            })
            .addCase(updateProductBlockingThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            }),
            builder
                .addCase(fetchDealerDetailsThunk.pending, (state, action) => {
                    state.isLoading = true
                    state.error = null
                })
                .addCase(fetchDealerDetailsThunk.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.dealerData = action.payload
                    state.error = null
                })
                .addCase(fetchDealerDetailsThunk.rejected, (state, action) => {
                    state.isLoading = false
                    state.error = `${action.error?.message || "Something went Wrong"}`
                    toast.error(state.error)
                })
    }
})

export default approvalsSlice.reducer;