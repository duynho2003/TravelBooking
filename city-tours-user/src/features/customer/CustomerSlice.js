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

export const updateCustomer = createAsyncThunk(
  "customers/updateCustomer",
  async (data) => {
    try {
      const response = await customerApi.updateCustomer(data);
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

export const getInfoCustomer = createAsyncThunk(
  "customers/getInfoCustomer",
  async (customerId) => {
    try {
      const response = await customerApi.getInfoCustomer(customerId);
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

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    info: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {
    logoutCustomer: (state, action) => {
      state.info = null;
    },
  },
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
    });

    builder.addCase(createCustomer.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });

    // Update customer
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }
    });

    builder.addCase(updateCustomer.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });

    // Get info customer
    builder.addCase(getInfoCustomer.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getInfoCustomer.fulfilled, (state, action) => {
      state.loading = false;

      state.info = action.payload;
    });

    builder.addCase(getInfoCustomer.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { logoutCustomer } = customerSlice.actions;

const { reducer } = customerSlice;

export default reducer;
