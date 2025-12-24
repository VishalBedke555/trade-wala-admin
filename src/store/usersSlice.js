import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import networkCall, { axiosNetworkCall } from "../api/Network";

export const fetchUsersThunk = createAsyncThunk('fetchUsers/fetchUsersThunk', async (payload) => {
    const response = await networkCall('fetchUsers', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const updateUserBlockingThunk = createAsyncThunk('updateUserBlocking/updateUserBlockingThunk', async (payload) => {
    const response = await networkCall('updateUserBlocking', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const fetchUserDetailsThunk = createAsyncThunk('fetchUserDetails/fetchUserDetailsThunk', async (payload) => {
    const response = await networkCall('fetchUserDetails', payload)
    try {
        if (response.status == 1) {
            return response.data;
        }
    } catch (error) {
        console.log(error)
    }
    throw response.message
})

export const deleteUserThunk = createAsyncThunk(
  'deleteUser/deleteUserThunk',
  async (payload) => {
    const response = await networkCall('deleteUser', payload);
    try {
      if (response.status === 1) {
        return { userId: payload.userId };
      }
    } catch (error) {
      console.log(error);
    }
    throw response.message;
  }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        isLoading: false,
        data: [],
        detailsData: null,
        pageCount: null,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsersThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
                state.data = []
                state.pageCount = null
            })
            .addCase(fetchUsersThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.data = action.payload.users
                state.pageCount = action.payload.page
                state.error = null
            })
            .addCase(fetchUsersThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            .addCase(updateUserBlockingThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateUserBlockingThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                toast.success("User Block Updated Successfully");

                state.data = state.data.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );

                state.error = null;
            })
            .addCase(updateUserBlockingThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            .addCase(fetchUserDetailsThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserDetailsThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.detailsData = action.payload
                state.error = null
            })
            .addCase(fetchUserDetailsThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })

            .addCase(deleteUserThunk.pending, (state, action) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = state.data.filter(user => user._id !== action.payload.userId);
                toast.success("User deleted successfully!");
                state.error = null;
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = `${action.error?.message || "Something went Wrong"}`
                toast.error(state.error)
            })
    }
})

export default usersSlice.reducer;