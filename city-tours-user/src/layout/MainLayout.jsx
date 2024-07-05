import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getWebsiteInfo } from "../features/website/WebsiteSlice";
import Loading from "../components/common/Loading";

export default function MainLayout() {
  // Constants
  const ID_INFO_WEBSITE = 15;

  // Redux State
  const dispatch = useDispatch();
  const websiteInfo = useSelector((state) => state.website?.info);
  const isLoading = useSelector((state) => state.website?.isLoading);
  const error = useSelector((state) => state.website?.error);

  // Local State
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    dispatch(getWebsiteInfo(ID_INFO_WEBSITE));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

      {showContent && (
        <>
          <Header websiteInfo={websiteInfo} />
          <Outlet />
          <Footer websiteInfo={websiteInfo} />
        </>
      )}
    </>
  );
}
