import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchCategoryThunk = createAsyncThunk('fetchCategory/fetchCategoryThunk', async (payload) => {
    const response = await networkCall('fetchCategories', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchSubCategoryThunk = createAsyncThunk('fetchSubCategory/fetchSubCategoryThunk', async (payload) => {
    const response = await networkCall('fetchSubCategories', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchChiledCategoryThunk = createAsyncThunk('fetchChiledCategory/fetchChiledCategoryThunk', async (payload) => {
    const response = await networkCall('fetchChildCategories', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateCategoryListingThunk = createAsyncThunk('updateCategoryListing/updateCategoryListingThunk', async (payload) => {
    const response = await networkCall('updateCategoryListing', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})
export const addCategoryThunk = createAsyncThunk('addCategory/addCategoryThunk', async (payload) => {
    const response = await networkCall('addCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateCategoryThunk = createAsyncThunk('updateCategory/updateCategoryThunk', async (payload) => {
    const response = await networkCall('updateCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const addSubCategoryThunk = createAsyncThunk('addSubCategory/addSubCategoryThunk', async (payload) => {
    const response = await networkCall('addSubCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const addChildCategoryThunk = createAsyncThunk('addChildCategory/addChildCategoryThunk', async (payload) => {
    const response = await networkCall('addChildCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateSubCategoryThunk = createAsyncThunk('updateSubCategory/updateSubCategoryThunk', async (payload) => {
    const response = await networkCall('updateSubCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateChildCategoryThunk = createAsyncThunk('updateChildCategory/updateChildCategoryThunk', async (payload) => {
    const response = await networkCall('updateChildCategory', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const deleteCategoryThunk = createAsyncThunk('deleteCategory/deleteCategoryThunk', async (payload) => {
    const response = await networkCall('deleteCategory', payload)
    try {
        if (response.status == 1) {
            return payload;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        isLoading: false,
        data: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
            })
            .addCase(fetchCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
        builder
            .addCase(updateCategoryListingThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateCategoryListingThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;

                // Ensure state.data exists and has a categories array before updating
                if (state.data && Array.isArray(state.data.categories)) {
                    state.data = {
                        ...state.data, // Preserve other properties
                        categories: state.data.categories.map((category) =>
                            category._id === updatedCategory._id ? updatedCategory : category
                        )
                    };
                }

                toast.success("Category Top List Updated Successfully!");
                state.error = null;
            })

            .addCase(updateCategoryListingThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(fetchSubCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
            })
            .addCase(fetchSubCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchSubCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(fetchChiledCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = null
            })
            .addCase(fetchChiledCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload
                state.error = null
            })
            .addCase(fetchChiledCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
        builder
            .addCase(addCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;
                state.data.categories.push(updatedCategory)

                toast.success("Category Added Successfully!");
                state.error = null;
            })
            .addCase(addCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(updateCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;

                // Ensure state.data exists and has a categories array before updating
                if (state.data && Array.isArray(state.data.categories)) {
                    state.data = {
                        ...state.data, // Preserve other properties
                        categories: state.data.categories.map((category) =>
                            category._id === updatedCategory._id ? updatedCategory : category
                        )
                    };
                }

                toast.success("Category Updated Successfully!");
                state.error = null;
            })

            .addCase(updateCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(addSubCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addSubCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;
                state.data.subCategories.push(updatedCategory)

                toast.success("Sub-category Added Successfully!");
                state.error = null;
            })
            .addCase(addSubCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(addChildCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(addChildCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;
                state.data.childCategories.push(updatedCategory)

                toast.success("Child-category Added Successfully!");
                state.error = null;
            })
            .addCase(addChildCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

        builder
            .addCase(updateSubCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateSubCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;

                // Ensure state.data exists and has a categories array before updating
                if (state.data && Array.isArray(state.data.subCategories)) {
                    state.data = {
                        ...state.data, // Preserve other properties
                        subCategories: state.data.subCategories.map((category) =>
                            category._id === updatedCategory._id ? updatedCategory : category
                        )
                    };
                }

                toast.success("Sub-category Updated Successfully!");
                state.error = null;
            })

        builder
            .addCase(updateChildCategoryThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateChildCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCategory = action.payload;

                // Ensure state.data exists and has a categories array before updating
                if (state.data && Array.isArray(state.data.childCategories)) {
                    state.data = {
                        ...state.data, // Preserve other properties
                        childCategories: state.data.childCategories.map((category) =>
                            category._id === updatedCategory._id ? updatedCategory : category
                        )
                    };
                }

                toast.success("Child-category Updated Successfully!");
                state.error = null;
            })

            .addCase(updateChildCategoryThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            });

        builder
            .addCase(deleteCategoryThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
                state.isLoading = false;

                // Check if payload exists and has required properties
                if (!action.payload || !action.payload.categoryType || !action.payload.docId) {
                    state.error = "Invalid payload received";
                    toast.error("Failed to delete category");
                    return;
                }

                const { categoryType, docId } = action.payload;

                try {
                    // Update state based on category type
                    switch (categoryType) {
                        case "childCategory":
                            state.data = {
                                ...state.data,
                                childCategories: state.data.childCategories.filter(
                                    (category) => category._id !== docId
                                )
                            };
                            toast.success("Child Category Deleted Successfully!");
                            break;

                        case "subCategory":
                            state.data = {
                                ...state.data,
                                subCategories: state.data.subCategories.filter(
                                    (category) => category._id !== docId
                                )
                            };
                            toast.success("Sub-Category Deleted Successfully!");
                            break;

                        case "category":
                            state.data = {
                                ...state.data,
                                categories: state.data.categories.filter(
                                    (category) => category._id !== docId
                                )
                            };
                            toast.success("Category Deleted Successfully!");
                            break;

                        default:
                            state.error = "Unknown category type";
                            toast.error("Failed to delete category: Unknown type");
                    }

                    state.error = null;
                } catch (error) {
                    state.error = "Error updating state after deletion";
                    toast.error("Failed to update categories list");
                }
            })
            .addCase(deleteCategoryThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error?.message || "Failed to delete category";
                toast.error(state.error);
            });
    }
})

export default categorySlice.reducer;