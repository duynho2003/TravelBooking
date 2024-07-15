import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import usersReducer from "../features/users/UserSlice";
import tourBookingReducer from "../features/tourBooking/TourBookingSlice";
import transactionsReducer from "../features/transaction/TransactionSlice";

const rootReducer = {
  auth: authReducer,
  users: usersReducer,
  tourBookings: tourBookingReducer,
  transactions: transactionsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
