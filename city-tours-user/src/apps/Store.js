import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import customerReducer from "../features/customer/CustomerSlice";
import websiteReducer from "../features/website/WebsiteSlice";
import provinceReducer from "../features/province/provinceSlice";
import toursReducer from "../features/tour/TourSlice";
import hotelsReducer from "../features/hotel/HotelSlice";
import reviewReducer from "../features/review/ReviewSlice";
import wishlistReducer from "../features/wishlist/WishlistSlice";
import bookingReducer from "../features/booking/BookingSlice";

const rootReducer = {
  auth: authReducer,
  customer: customerReducer,
  website: websiteReducer,
  provinces: provinceReducer,
  tours: toursReducer,
  hotels: hotelsReducer,
  reviews: reviewReducer,
  wishlists: wishlistReducer,
  bookings: bookingReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
