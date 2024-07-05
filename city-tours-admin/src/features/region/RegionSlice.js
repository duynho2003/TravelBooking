import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import regionApi from "../../services/region/RegionApi";

export const getAllRegions = createAsyncThunk(
  "regions/getAllRegions",
  async (panigation) => {
    try {
      const response = await regionApi.getAllRegions(panigation);
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

export const createRegion = createAsyncThunk(
  "regions/createRegion",
  async (data) => {
    try {
      const response = await regionApi.createRegion(data);
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

export const updateRegion = createAsyncThunk(
  "regions/updateRegion",
  async (data) => {
    try {
      const response = await regionApi.updateRegion(data);
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

export const getRegionById = createAsyncThunk(
  "regions/getRegionById",
  async (regionId) => {
    try {
      const response = await regionApi.getRegionById(regionId);
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

// export const createAccount = createAsyncThunk(
//   "users/createAccount",
//   async (data) => {
//     try {
//       const response = await userApi.createAccount(data);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

// export const updateAccount = createAsyncThunk(
//   "users/updateAccount",
//   async (data) => {
//     try {
//       const response = await userApi.updateAccount(data);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

// export const deleteAccount = createAsyncThunk(
//   "users/deleteAccount",
//   async (userId) => {
//     try {
//       const response = await userApi.deleteAccount(userId);
//       console.log("response slice: ", response);

//       if (response?.error) {
//         console.log("response slice error: ", response.error);
//         return { error: response.error };
//       }

//       return response;
//     } catch (error) {
//       console.log("response slice error: ", error);
//       return { error };
//     }
//   }
// );

const regionSlice = createSlice({
  name: "regions",
  initialState: {
    list: [],
    selectedRegion: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    message: "",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all regions
    builder.addCase(getAllRegions.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllRegions.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }

      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
    });

    builder.addCase(getAllRegions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Create region
    builder.addCase(createRegion.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createRegion.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(createRegion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get account by id
    builder.addCase(getRegionById.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getRegionById.fulfilled, (state, action) => {
      state.isLoading = false;

      if (action.payload.error) {
        state.message = action.payload.error.message;
        state.error = action.payload.error.moreInfo;
      } else {
        state.message = null;
        state.error = null;
      }

      state.selectedRegion = action.payload.data;
    });

    builder.addCase(getRegionById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Update region
    builder.addCase(updateRegion.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateRegion.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateRegion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // // Create user
    // builder.addCase(createAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(createAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(createAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Update user
    // builder.addCase(updateAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(updateAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(updateAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Delete user
    // builder.addCase(deleteAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(deleteAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;

    //   if (action.payload.error) {
    //     state.message = action.payload.error.message;
    //     state.error = action.payload.error.moreInfo;
    //   } else {
    //     state.message = null;
    //     state.error = null;
    //   }
    // });

    // builder.addCase(deleteAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

const { reducer } = regionSlice;

export default reducer;
