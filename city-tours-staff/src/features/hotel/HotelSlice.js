import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelApi from "../../services/hotel/HotelApi";

export const getAllHotels = createAsyncThunk(
  "hotels/getAllHotels",
  async (panigation) => {
    try {
      const response = await hotelApi.getAllHotels(panigation);
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

const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    list: [],
    selectedHotel: null,
    selectedRoom: null,
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
    builder.addCase(getAllHotels.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllHotels.fulfilled, (state, action) => {
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllHotels.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = hotelSlice;

export default reducer;
