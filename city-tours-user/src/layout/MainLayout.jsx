import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getWebsiteInfo } from "../features/website/WebsiteSlice";
import Loading from "../components/common/Loading";
import Cookies from "js-cookie";
import { getInfoCustomer } from "../features/customer/CustomerSlice";

export default function MainLayout() {
  // Constants
  const ID_INFO_WEBSITE = 1;

  // Redux State
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const websiteInfo = useSelector((state) => state.website?.info);

  useEffect(() => {
    dispatch(getWebsiteInfo(ID_INFO_WEBSITE));

    // localStorage.setItem("wishlist", []);
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getInfoCustomer(userId));
    }
  }, [dispatch, userId]);

  return (
    <>
      <>
        <Header websiteInfo={websiteInfo} />
        <Outlet />
        <Footer websiteInfo={websiteInfo} />
      </>
    </>
  );
}
