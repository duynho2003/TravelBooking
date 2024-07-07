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

export default function TourDetail() {
  // Redux Store
  const dispatch = useDispatch();
  const tour = useSelector((state) => state.tours?.selectedTour);
  const { tourId } = useParams();

  //Local State
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
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
          <Content tour={tour} />
        </>
      )}
    </>
  );
}
