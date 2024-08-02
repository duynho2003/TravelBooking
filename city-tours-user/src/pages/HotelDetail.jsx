import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllTours, getTourById } from "../features/tour/TourSlice";
import { getAllHotels, getHotelById } from "../features/hotel/HotelSlice";
import Banner from "../components/hotel/Banner";
import Detail from "../components/hotel/Detail";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { getHotelReviewsByHotelId } from "../features/review/ReviewSlice";

export default function HotelDetail() {
  // Redux Store
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const hotel = useSelector((state) => state.hotels?.selectedHotel);
  const reviews = useSelector((state) => state.reviews?.listHotelReviews);
  const { hotelId } = useParams();

  //Local State
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getHotelReviewsByHotelId(hotelId));
    dispatch(getHotelById(hotelId))
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

  const sortedReviews = reviews
    ?.filter((review) => review?.createdAt)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
          <Banner hotel={hotel} />
          <Detail userId={userId} hotel={hotel} reviews={sortedReviews} />
        </>
      )}
    </>
  );
}
