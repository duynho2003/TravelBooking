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
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tours/:tourId" element={<TourDetail />} />
            <Route path="/checkout/:tourId" element={<TourCheckout />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
