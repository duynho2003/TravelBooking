import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import provinceApi from "../../services/province/ProvinceApi";

export const getAllProvinces = createAsyncThunk(
  "provinces/getAllProvinces",
  async () => {
    try {
      const response = await provinceApi.getAllProvinces();
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

const provinceSlice = createSlice({
  name: "provinces",
  initialState: {
    list: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all provinces
    builder.addCase(getAllProvinces.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllProvinces.fulfilled, (state, action) => {
      state.loading = false;

      state.list = action.payload.data;
    });

    builder.addCase(getAllProvinces.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = provinceSlice;

export default reducer;
