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
import Banner from "../components/tour/Banner";
import Content from "../components/tour/Content";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import { getTourReviewsByTourId } from "../features/review/ReviewSlice";

export default function TourDetail() {
  // Redux Store
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const tours = useSelector((state) => state.tours?.list);
  const tour = useSelector((state) => state.tours?.selectedTour);
  const reviews = useSelector((state) => state.reviews?.listTourReviews);
  const { tourId } = useParams();

  //Local State
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getTourReviewsByTourId(tourId));

    dispatch(getTourById(tourId))
      .then(() => {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch]);

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
          <Banner tour={tour} />
          <Content userId={userId} tour={tour} reviews={sortedReviews} />
        </>
      )}
    </>
  );
}
