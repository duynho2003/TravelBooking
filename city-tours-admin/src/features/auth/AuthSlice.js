import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../services/auth/AuthApi";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";

export const register = createAsyncThunk("auth/register", async (data) => {
  try {
    const response = await authApi.register(data);
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
});

export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await authApi.login(data);
    console.log("response slice: ", response);

    if (response?.error) {
      console.log("response slice error: ", response.error.data);
      return { error: response.error.data };
    }

    return response;
  } catch (error) {
    console.log("response slice error: ", error);

    return { error };
  }
});

export const initInfoBeforeReload = createAsyncThunk(
  "auth/initInfoBeforeReload",
  () => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = decodeToken(token);
      return decodedToken;
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    info: null,
    loading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Init state
    builder.addCase(initInfoBeforeReload.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(initInfoBeforeReload.fulfilled, (state, action) => {
      state.info = action.payload;
    });

    builder.addCase(initInfoBeforeReload.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }
    });

    builder.addCase(login.rejected, (state, action) => {
      state.info = [];
      state.loading = false;
      state.error = action.error.message;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload.error) {
        state.error = action.payload.error;
      } else {
        state.message = action.payload.data;
      }
    });

    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const { reducer } = authSlice;

export default reducer;
