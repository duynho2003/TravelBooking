import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingApi from "../../services/booking/BookingApi";

export const getAllRoomBookingsByUserId = createAsyncThunk(
  "bookings/getAllRoomBookingsByUserId",
  async (panigation) => {
    try {
      const response = await bookingApi.getAllRoomBookingsByUserId(panigation);
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

export const getAllTourBookingsByUserId = createAsyncThunk(
  "bookings/getAllTourBookingsByUserId",
  async (panigation) => {
    try {
      const response = await bookingApi.getAllTourBookingsByUserId(panigation);
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

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    roomBookingsList: [],
    tourBookingsList: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all room bookings by userId
    builder.addCase(getAllRoomBookingsByUserId.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllRoomBookingsByUserId.fulfilled, (state, action) => {
      state.roomBookingsList = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllRoomBookingsByUserId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get all tour bookings by userId
    builder.addCase(getAllTourBookingsByUserId.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllTourBookingsByUserId.fulfilled, (state, action) => {
      state.tourBookingsList = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllTourBookingsByUserId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = bookingSlice;

export default reducer;
