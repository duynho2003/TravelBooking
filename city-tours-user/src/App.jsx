import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TourDetail from "./pages/TourDetail";
import TourCheckout from "./pages/TourCheckout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initInfoBeforeReload } from "./features/auth/AuthSlice";
import ScrollToTopOnNavigate from "./utils/ScrollToTopOnNavigate";
import TourList from "./pages/TourList";
import HotelList from "./pages/HotelList";
import HotelDetail from "./pages/HotelDetail";
import HotelCheckout from "./pages/HotelCheckout";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import RoomBookings from "./pages/RoomBookings";
import TourBookings from "./pages/TourBookings";
import ConfirmAccount from "./pages/ConfirmAccount";
import ResetPassword from "./pages/ResetPassword";
import RequestResetPassword from "./pages/RequestResetPassword";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";

function App() {
  // Redux State
  const dispatch = useDispatch();

  // useEffect loading info data
  useEffect(() => {
    dispatch(initInfoBeforeReload());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Home */}
            <Route index element={<Home />} />

            {/* Auth */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/confirm-account/:token"
              element={<ConfirmAccount />}
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/request-reset-password"
              element={<RequestResetPassword />}
            />

            {/* Customer */}
            <Route path="/profile" element={<Profile />} />

            {/* Tours */}
            <Route path="/tours/:tourId" element={<TourDetail />} />
            <Route path="/tours/list" element={<TourList />} />
            <Route path="/checkout/:tourId" element={<TourCheckout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />

            {/* Hotels */}
            <Route path="/hotels/list" element={<HotelList />} />
            <Route path="/hotels/:hotelId" element={<HotelDetail />} />
            <Route
              path="/hotels/checkout/:roomId"
              element={<HotelCheckout />}
            />

            {/* Wishlist */}
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Bookings */}
            <Route path="/room/bookings" element={<RoomBookings />} />
            <Route path="/tour/bookings" element={<TourBookings />} />

            {/* Blogs */}
            <Route path="/blogs/list" element={<BlogList />} />
            <Route path="/blogs/:blogId" element={<BlogDetail />} />

            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
