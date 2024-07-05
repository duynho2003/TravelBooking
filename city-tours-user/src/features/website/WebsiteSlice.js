import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import websiteApi from "../../services/website/WebsiteApi";

export const getWebsiteInfo = createAsyncThunk(
  "website/getWebsiteInfo",
  async (websiteId) => {
    const response = await websiteApi.getWebsiteInfo(websiteId);
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  }
);

const websiteSlice = createSlice({
  name: "website",
  initialState: {
    info: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get website info
    builder.addCase(getWebsiteInfo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getWebsiteInfo.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.error = action.error.message;
      } else {
        state.info = action.payload;
      }

      state.isLoading = false;
    });

    builder.addCase(getWebsiteInfo.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = websiteSlice;

export default reducer;
