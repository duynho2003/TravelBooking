import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllTours, getTourById } from "../features/tour/TourSlice";
import { getAllHotels } from "../features/hotel/HotelSlice";
import Banner from "../components/checkout/Banner";
import List from "../components/wishlist/List";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { getAllWishlistsByUserId } from "../features/wishlist/WishlistSlice";

export default function Wishlist() {
  // Redux State
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const wishlists = useSelector((state) => state.wishlists?.list);

  // Local State
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllWishlistsByUserId(userId))
      .then(() => {
        scrollToTop();

        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show content */}
      {showContent && (
        <>
          <Row
            style={{
              width: "100%",
              height: "110px",
            }}
          ></Row>
          <List userId={userId} wishlists={wishlists} />
        </>
      )}
    </>
  );
}
