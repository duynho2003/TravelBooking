import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewApi from "../../services/review/ReviewApi";

export const createHotelReview = createAsyncThunk(
  "reviews/createHotelReview",
  async (data) => {
    try {
      const response = await reviewApi.createHotelReview(data);
      console.log("response slice: ", response);

      if (response?.error) {
        console.log("response slice error: ", response.error);
        return { error: response.error };
      }

      return response;
    } catch (error) {
      console.log("response slice error: ", error);

      return { error };
    }
  }
);

export const getHotelReviewsByHotelId = createAsyncThunk(
  "reviews/getHotelReviewsByHotelId",
  async (hotelId) => {
    try {
      const response = await reviewApi.getHotelReviewsByHotelId(hotelId);
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

export const createTourReview = createAsyncThunk(
  "reviews/createTourReview",
  async (data) => {
    try {
      const response = await reviewApi.createTourReview(data);
      console.log("response slice: ", response);

      if (response?.error) {
        console.log("response slice error: ", response.error);
        return { error: response.error };
      }

      return response;
    } catch (error) {
      console.log("response slice error: ", error);

      return { error };
    }
  }
);

export const getTourReviewsByTourId = createAsyncThunk(
  "reviews/getTourReviewsByTourId",
  async (tourId) => {
    try {
      const response = await reviewApi.getTourReviewsByTourId(tourId);
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

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    list: null,
    listHotelReviews: null,
    listTourReviews: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Create hotel review
    builder.addCase(createHotelReview.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createHotelReview.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(createHotelReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get hotel reviews by hotel id
    builder.addCase(getHotelReviewsByHotelId.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getHotelReviewsByHotelId.fulfilled, (state, action) => {
      state.listHotelReviews = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.loading = false;
    });

    builder.addCase(getHotelReviewsByHotelId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create tour review
    builder.addCase(createTourReview.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createTourReview.fulfilled, (state, action) => {
      state.loading = false;
    });

    builder.addCase(createTourReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get tour reviews by tour id
    builder.addCase(getTourReviewsByTourId.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getTourReviewsByTourId.fulfilled, (state, action) => {
      state.listTourReviews = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.loading = false;
    });

    builder.addCase(getTourReviewsByTourId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = reviewSlice;

export default reducer;
