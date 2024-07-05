import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllTours, getTourById } from "../features/tour/TourSlice";
import { getAllHotels } from "../features/hotel/HotelSlice";
import Banner from "../components/tour/Banner";
import Content from "../components/tour/Content";
import { useParams } from "react-router-dom";

export default function TourDetail() {
  // Redux Store
  const dispatch = useDispatch();

  const tour = useSelector((state) => state.tours?.selectedTour);
  const isLoading = useSelector((state) => state.tours?.isLoading);
  const error = useSelector((state) => state.tours?.error);

  const { tourId } = useParams();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getTourById(tourId));
  }, [dispatch]);

  return (
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
  );
}
