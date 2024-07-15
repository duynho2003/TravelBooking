import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import wishlistApi from "../../services/wishlist/WishlistApi";

export const createWishlist = createAsyncThunk(
  "wishlists/createWishlist",
  async (data) => {
    try {
      const response = await wishlistApi.createWishlist(data);
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

export const deleteWishlist = createAsyncThunk(
  "wishlists/deleteWishlist",
  async (wishlistId) => {
    try {
      const response = await wishlistApi.deleteWishlist(wishlistId);
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

export const getAllWishlistsByUserId = createAsyncThunk(
  "wishlists/getAllWishlistsByUserId",
  async (userId) => {
    try {
      const response = await wishlistApi.getAllWishlistsByUserId(userId);
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

const wishlistSlice = createSlice({
  name: "wishlists",
  initialState: {
    list: [],
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all wishlists
    builder.addCase(getAllWishlistsByUserId.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllWishlistsByUserId.fulfilled, (state, action) => {
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllWishlistsByUserId.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });

    // Create wishlist
    builder.addCase(createWishlist.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createWishlist.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }
    });

    builder.addCase(createWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Delete wishlist
    builder.addCase(deleteWishlist.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(deleteWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = wishlistSlice;

export default reducer;
