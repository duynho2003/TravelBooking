import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import NotFound from "./pages/auth/NotFound";
import MainLayout from "./layouts/MainLayout";
import ScrollToTopOnNavigate from "./components/common/ScrollToTopOnNavigate";
import { useDispatch } from "react-redux";
import { initInfoBeforeReload } from "./features/auth/AuthSlice";
import { useEffect } from "react";
import CreateTransaction from "./pages/transactions/CreateTransaction";
import ResultTransaction from "./pages/transactions/ResultTransaction";
import ViewTransactions from "./pages/transactions/ViewTransactions";
import ViewTourBookings from "./pages/tourBookings/ViewTourBookings";
import ViewRoomBookings from "./pages/tourBookings/ViewRoomBookings";

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
          <Route path="/*" element={<NotFound />} />
          <Route path="/staff/" element={<MainLayout />}>
            {/* Bookings management */}
            <Route path="bookings/tour/view" element={<ViewTourBookings />} />
            <Route path="bookings/hotel/view" element={<ViewRoomBookings />} />

            {/* Transactions management */}
            <Route path="transactions/view" element={<ViewTransactions />} />
            <Route path="transactions/create" element={<CreateTransaction />} />
            <Route path="transactions/result" element={<ResultTransaction />} />

            {/* Not found */}
            <Route path="staff/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
