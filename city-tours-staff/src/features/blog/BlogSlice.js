import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogApi from "../../services/blog/BlogApi";

export const getAllBlogs = createAsyncThunk(
  "blogs/getAllBlogs",
  async (panigation) => {
    const response = await blogApi.getAllBlogs(panigation);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  }
);

export const getBlogById = createAsyncThunk(
  "blogs/getBlogById",
  async (blogId) => {
    const response = await blogApi.getBlogById(blogId);
    if (response.data) {
      return response;
    } else {
      return response;
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (blogId) => {
    const response = await blogApi.deleteBlog(blogId);
    if (response.data) {
      return response;
    } else {
      return response;
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
      state.selectedBlog = action.payload.data;
      state.isLoading = false;
    });

    builder.addCase(getBlogById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Delete blog
    builder.addCase(deleteBlog.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteBlog.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(deleteBlog.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = blogSlice;

export default reducer;
