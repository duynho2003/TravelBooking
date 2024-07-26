import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogApi from "../../services/blog/BlogApi";

export const getAllBlogs = createAsyncThunk(
  "blogs/getAllBlogs",
  async (panigation) => {
    try {
      const response = await blogApi.getAllBlogs(panigation);
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

export const getBlogById = createAsyncThunk(
  "hotels/getBlogById",
  async (blogId) => {
    try {
      const response = await blogApi.getBlogById(blogId);
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

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    selectedBlog: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all blogs
    builder.addCase(getAllBlogs.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllBlogs.fulfilled, (state, action) => {
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllBlogs.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get blog by id
    builder.addCase(getBlogById.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getBlogById.fulfilled, (state, action) => {
      state.selectedBlog = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getBlogById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = blogSlice;

export default reducer;
