import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import customerApi from "../../services/customer/CustomerApi";

export const createCustomer = createAsyncThunk(
  "customers/createCustomer",
  async (data) => {
    try {
      const response = await customerApi.createCustomer(data);
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

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    info: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Create customer
    builder.addCase(createCustomer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }

      state.info = action.payload;
    });

    builder.addCase(createCustomer.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = customerSlice;

export default reducer;
