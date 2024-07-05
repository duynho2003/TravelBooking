import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import websiteReducer from "../features/website/WebsiteSlice";
import usersReducer from "../features/users/UserSlice";
import regionReducer from "../features/region/RegionSlice";
import toursReducer from "../features/tour/TourSlice";
import hotelsReducer from "../features/hotel/HotelSlice";
import tourBookingReducer from "../features/tourBooking/TourBookingSlice";
import transactionsReducer from "../features/transaction/TransactionSlice";

const rootReducer = {
  auth: authReducer,
  website: websiteReducer,
  users: usersReducer,
  regions: regionReducer,
  tours: toursReducer,
  hotels: hotelsReducer,
  tourBookings: tourBookingReducer,
  transactions: transactionsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
