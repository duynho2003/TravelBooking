import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import hotelApi from "../../services/hotel/HotelApi";

export const getAllHotels = createAsyncThunk(
  "hotels/getAllHotels",
  async (panigation) => {
    try {
      const response = await hotelApi.getAllHotels(panigation);
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

export const getHotelById = createAsyncThunk(
  "hotels/getHotelById",
  async (hotelId) => {
    try {
      const response = await hotelApi.getHotelById(hotelId);
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

export const getRoomById = createAsyncThunk(
  "hotels/getRoomById",
  async (roomId) => {
    try {
      const response = await hotelApi.getRoomById(roomId);
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

export const createRoom = createAsyncThunk(
  "hotels/createRoom",
  async (data) => {
    try {
      const response = await hotelApi.createRoom(data);
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

export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async (data) => {
    try {
      const response = await hotelApi.updateHotel(data);
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

export const updateRoom = createAsyncThunk(
  "hotels/updateRoom",
  async (data) => {
    try {
      const response = await hotelApi.updateRoom(data);
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

export const deleteRoom = createAsyncThunk(
  "hotels/deleteRoom",
  async (roomId) => {
    const response = await hotelApi.deleteRoom(roomId);
    if (response.data) {
      return response;
    } else {
      return response;
    }
  }
);

// export const changeStatusAccount = createAsyncThunk(
//   "users/changeStatusAccount",
//   async (data) => {
//     const response = await userApi.changeStatusAccount(data);
//     if (response.data) {
//       return response.data;
//     } else {
//       return response;
//     }
//   }
// );

// export const createAccount = createAsyncThunk(
//   "users/createAccount",
//   async (data) => {
//     const response = await userApi.createAccount(data);
//     if (response.data) {
//       return response;
//     } else {
//       return response;
//     }
//   }
// );

// export const updateAccount = createAsyncThunk(
//   "users/updateAccount",
//   async (data) => {
//     const response = await userApi.updateAccount(data);
//     if (response.data) {
//       return response;
//     } else {
//       return response;
//     }
//   }
// );

const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    list: [],
    selectedHotel: null,
    selectedRoom: null,
    page: null,
    limit: null,
    skip: null,
    totals: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Get all tours
    builder.addCase(getAllHotels.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getAllHotels.fulfilled, (state, action) => {
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.skip = action.payload.skip;
      state.totals = action.payload.totals;
      state.isLoading = false;
    });

    builder.addCase(getAllHotels.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get hotel by id
    builder.addCase(getHotelById.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getHotelById.fulfilled, (state, action) => {
      state.selectedHotel = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getHotelById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Get room by id
    builder.addCase(getRoomById.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getRoomById.fulfilled, (state, action) => {
      state.selectedRoom = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getRoomById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Create room
    builder.addCase(createRoom.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(createRoom.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(createRoom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Update hotel
    builder.addCase(updateHotel.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateHotel.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateHotel.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Update room
    builder.addCase(updateRoom.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateRoom.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateRoom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // Delete room
    builder.addCase(deleteRoom.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(deleteRoom.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });

    // // Change status user
    // builder.addCase(changeStatusAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(changeStatusAccount.fulfilled, (state, action) => {
    //   // state.list = action.payload.data;
    //   // state.page = action.payload.page;
    //   // state.limit = action.payload.limit;
    //   // state.skip = action.payload.skip;
    //   // state.totals = action.payload.totals;
    //   state.isLoading = false;
    // });

    // builder.addCase(changeStatusAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });

    // // Create user
    // builder.addCase(createAccount.pending, (state) => {
    //   state.isLoading = true;
    // });

    // builder.addCase(createAccount.fulfilled, (state, action) => {
    //   state.isLoading = false;
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
    // });

    // builder.addCase(updateAccount.rejected, (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.error.message;
    // });
  },
});

const { reducer } = hotelSlice;

export default reducer;
