import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/auth/NotFound";
import LayoutAdmin from "./layouts/LayoutAdmin";
import ScrollToTopOnNavigate from "./components/common/ScrollToTopOnNavigate";
import ViewInfoWebsite from "./pages/website/ViewInfoWebsite";
import UpdateInfoWebsite from "./pages/website/UpdateInfoWebsite";
import ViewUsers from "./pages/users/ViewUsers";
import CreateUser from "./pages/users/CreateUser";
import UpdateUser from "./pages/users/UpdateUser";
import CreateTour from "./pages/tours/CreateTour";
import { useDispatch } from "react-redux";
import { initInfoBeforeReload } from "./features/auth/AuthSlice";
import { useEffect } from "react";
import ViewTours from "./pages/tours/ViewTours";
import ViewATour from "./pages/tours/ViewATour";
import UpdateTour from "./pages/tours/UpdateTour";
import ViewHotels from "./pages/hotels/ViewHotels";
import CreateHotel from "./pages/hotels/CreateHotel";
import ViewAHotel from "./pages/hotels/ViewAHotel";
import UpdateHotel from "./pages/hotels/UpdateHotel";

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
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/admin/" element={<LayoutAdmin />}>
            {/* Website management */}
            <Route path="website/view" element={<ViewInfoWebsite />} />
            <Route path="website/update" element={<UpdateInfoWebsite />} />

            {/* Users management */}
            <Route path="users/view" element={<ViewUsers />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/update/:userId" element={<UpdateUser />} />

            {/* Tours management */}
            <Route path="tours/view" element={<ViewTours />} />
            <Route path="tours/view/:tourId" element={<ViewATour />} />
            <Route path="tours/create" element={<CreateTour />} />
            <Route path="tours/update/:tourId" element={<UpdateTour />} />

            {/* Hotels management */}
            <Route path="hotels/view" element={<ViewHotels />} />
            <Route path="hotels/view/:hotelId" element={<ViewAHotel />} />
            <Route path="hotels/create" element={<CreateHotel />} />
            <Route path="hotels/update/:hotelId" element={<UpdateHotel />} />

            {/* Bookings management */}
            <Route path="bookings/view" element={<ViewInfoWebsite />} />
            <Route path="bookings/create" element={<ViewInfoWebsite />} />
            <Route path="bookings/update" element={<ViewInfoWebsite />} />

            {/* Not found */}
            <Route path="admin/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
