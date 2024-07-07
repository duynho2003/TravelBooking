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

// export const getAllHotelReviews = createAsyncThunk(
//   "reviews/getAllHotelReviews",
//   async () => {
//     try {
//       const response = await reviewApi.getAllHotelReviews();
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response.data;
//     } catch (error) {
//       console.log("response slice error: ", error);

//       return { error };
//     }
//   }
// );

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

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    list: null,
    listHotelReviews: null,
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

      // if (action.payload.error) {
      //   state.message = action.payload.error.message;
      //   state.error = action.payload.error.moreInfo;
      // } else {
      //   state.message = null;
      //   state.error = null;
      // }
    });

    builder.addCase(createHotelReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Get all hotel reviews
    // builder.addCase(getAllHotelReviews.pending, (state) => {
    //   state.loading = true;
    // });

    // builder.addCase(getAllHotelReviews.fulfilled, (state, action) => {
    //   state.list = action.payload.data;
    //   state.page = action.payload.page;
    //   state.limit = action.payload.limit;
    //   state.skip = action.payload.skip;
    //   state.totals = action.payload.totals;
    //   state.loading = false;
    // });

    // builder.addCase(getAllHotelReviews.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message;
    // });

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
  },
});

const { reducer } = reviewSlice;

export default reducer;
