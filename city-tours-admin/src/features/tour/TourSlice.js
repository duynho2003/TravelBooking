import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tourApi from "../../services/tour/TourApi";

export const getAllTours = createAsyncThunk(
  "tours/getAllTours",
  async (panigation) => {
    const response = await tourApi.getAllTours(panigation);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  }
);

export const getTourById = createAsyncThunk(
  "tours/getTourById",
  async (tourId) => {
    const response = await tourApi.getTourById(tourId);
    if (response.data) {
      return response;
    } else {
      return response;
    }
  }
);

export const deleteTour = createAsyncThunk(
  "tours/deleteTour",
  async (tourId) => {
    const response = await tourApi.deleteTour(tourId);
    if (response.data) {
      return response;
    } else {
      return response;
    }
  }
);

// export const changeStatusAccount = createAsyncThunk(
//   "users/changeStatusAccount",
//   async (data) => {
//     const response = await userApi.changeStatusAccount(data);
//     if (response.data) {
//       return response.data;
//     } else {
//       return response;
//     }
//   }
// );

// export const createAccount = createAsyncThunk(
//   "users/createAccount",
//   async (data) => {
//     const response = await userApi.createAccount(data);
//     if (response.data) {
//       return response;
//     } else {
//       return response;
//     }
//   }
// );

// export const updateAccount = createAsyncThunk(
//   "users/updateAccount",
//   async (data) => {
//     const response = await userApi.updateAccount(data);
//     if (response.data) {
//       return response;
//     } else {
//       return response;
//     }
//   }
// );

const tourSlice = createSlice({
  name: "tours",
  initialState: {
    list: [],
    selectedTour: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all tours
    builder.addCase(getAllTours.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllTours.fulfilled, (state, action) => {
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllTours.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get tour by id
    builder.addCase(getTourById.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getTourById.fulfilled, (state, action) => {
      state.selectedTour = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getTourById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Delete tour
    builder.addCase(deleteTour.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteTour.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(deleteTour.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // // Change status user
    // builder.addCase(changeStatusAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(changeStatusAccount.fulfilled, (state, action) => {
    //   // state.list = action.payload.data;
    //   // state.page = action.payload.page;
    //   // state.limit = action.payload.limit;
    //   // state.skip = action.payload.skip;
    //   // state.totals = action.payload.totals;
    //   state.isLoading = false;
    // });

    // builder.addCase(changeStatusAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Create user
    // builder.addCase(createAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(createAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;
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
    // });

    // builder.addCase(updateAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

const { reducer } = tourSlice;

export default reducer;
