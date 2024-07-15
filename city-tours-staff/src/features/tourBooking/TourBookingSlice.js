import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourBookingApi from "../../services/tourBookings/TourBooking";

export const getAllTourBookings = createAsyncThunk(
  "tourBookings/getAllTourBookings",
  async (panigation) => {
    try {
      const response = await tourBookingApi.getAllTourBookings(panigation);
      console.log("response slice: ", response);

      if (response?.error) {
        console.log("response slice error: ", response.error);
        return { error: response.error };
      }

      return response.data;
    } catch (error) {
      console.log("response slice error: ", error);
      return { error };
    }
  }
);

export const getAllRoomBookings = createAsyncThunk(
  "tourBookings/getAllRoomBookings",
  async (panigation) => {
    try {
      const response = await tourBookingApi.getAllRoomBookings(panigation);
      console.log("response slice: ", response);

      if (response?.error) {
        console.log("response slice error: ", response.error);
        return { error: response.error };
      }

      return response.data;
    } catch (error) {
      console.log("response slice error: ", error);
      return { error };
    }
  }
);

// export const getAccountById = createAsyncThunk(
//   "users/getAccountById",
//   async (userId) => {
//     try {
//       const response = await userApi.getAccountById(userId);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

// export const createAccount = createAsyncThunk(
//   "users/createAccount",
//   async (data) => {
//     try {
//       const response = await userApi.createAccount(data);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

// export const updateAccount = createAsyncThunk(
//   "users/updateAccount",
//   async (data) => {
//     try {
//       const response = await userApi.updateAccount(data);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

// export const deleteAccount = createAsyncThunk(
//   "users/deleteAccount",
//   async (userId) => {
//     try {
//       const response = await userApi.deleteAccount(userId);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

const tourBookingSlice = createSlice({
  name: "tourBookings",
  initialState: {
    list: [],
    roomBookingsList: null,
    selectedTourBooking: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all tour bookings
    builder.addCase(getAllTourBookings.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllTourBookings.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }

      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
    });

    builder.addCase(getAllTourBookings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get all room bookings
    builder.addCase(getAllRoomBookings.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllRoomBookings.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }

      state.roomBookingsList = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
    });

    builder.addCase(getAllRoomBookings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // // Get account by id
    // builder.addCase(getAccountById.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(getAccountById.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }

    //   state.selectedUser = action.payload.data;
    // });

    // builder.addCase(getAccountById.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Create user
    // builder.addCase(createAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(createAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(createAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Update user
    // builder.addCase(updateAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(updateAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(updateAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Delete user
    // builder.addCase(deleteAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(deleteAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(deleteAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

const { reducer } = tourBookingSlice;

export default reducer;
