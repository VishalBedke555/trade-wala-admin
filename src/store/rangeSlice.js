import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall from "../api/Network";

// Fetch KM Ranges
export const fetchKmRangesThunk = createAsyncThunk(
    "ranges/fetchKmRangesThunk",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await networkCall("fetchKmRanges", payload);
            if (response.status === 1) {
                return response.data;
            }
            throw new Error(response.message || "Failed to fetch KM ranges");
        } catch (error) {
            console.error("Fetch Error:", error);
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Add KM Range
export const addKmRangeThunk = createAsyncThunk(
    "ranges/addKmRangeThunk",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await networkCall("addKmRange", payload);
            if (response.status === 1) {
                toast.success("KM Range added successfully");
                return payload; // Return the new range to update state
            }
            throw new Error(response.message || "Failed to add KM range");
        } catch (error) {
            console.error("Add Error:", error);
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

// Remove KM Range
export const removeKmRangeThunk = createAsyncThunk(
    "ranges/removeKmRangeThunk",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await networkCall("removeKmRange", (payload));
            if (response.status === 1) {
                toast.success("KM Range removed successfully");
                return payload; // Return the deleted range to update state
            }
            throw new Error(response.message || "Failed to remove KM range");
        } catch (error) {
            console.error("Remove Error:", error);
            return rejectWithValue(error.message || "Something went wrong");
        }
    }
);

const rangesSlice = createSlice({
    name: "ranges",
    initialState: {
        isLoading: false,
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch KM Ranges
            .addCase(fetchKmRangesThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.data = [];
            })
            .addCase(fetchKmRangesThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchKmRangesThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Add KM Range
            .addCase(addKmRangeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addKmRangeThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    const formattedRange = `${action.payload.startRange}-${action.payload.endRange}`;
                    state.data = [...state.data, formattedRange]; // Add as a formatted string
                }
                state.error = null;
            })
            .addCase(addKmRangeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })

            // Remove KM Range
            .addCase(removeKmRangeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeKmRangeThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(range => range !== `${action.payload.startRange}-${action.payload.endRange}`);
                state.error = null;
            })
            .addCase(removeKmRangeThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                toast.error(action.payload);
            });
    },
});

export default rangesSlice.reducer;
