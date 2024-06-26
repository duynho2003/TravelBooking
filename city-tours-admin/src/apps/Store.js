import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import websiteReducer from "../features/website/WebsiteSlice";
import usersReducer from "../features/users/UserSlice";
import toursReducer from "../features/tour/TourSlice";
import hotelsReducer from "../features/hotel/HotelSlice";

const rootReducer = {
  auth: authReducer,
  website: websiteReducer,
  users: usersReducer,
  tours: toursReducer,
  hotels: hotelsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
