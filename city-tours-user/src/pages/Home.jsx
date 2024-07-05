import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllTours } from "../features/tour/TourSlice";
import { getAllHotels } from "../features/hotel/HotelSlice";
import { initInfoBeforeReload } from "../features/auth/AuthSlice";

export default function Home() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const dispatch = useDispatch();
  const tours = useSelector((state) => state.tours?.list);
  // const totalPages = useSelector((state) => state.tours?.totals);
  // const currentPage = useSelector((state) => state.tours?.page);
  // const isLoading = useSelector((state) => state.tours?.isLoading);
  // const error = useSelector((state) => state.tours?.error);

  const hotels = useSelector((state) => state.hotels?.list);
  // const totalPages = useSelector((state) => state.hotels?.totals);
  // const currentPage = useSelector((state) => state.hotels?.page);
  // const isLoading = useSelector((state) => state.hotels?.isLoading);
  // const error = useSelector((state) => state.hotels?.error);

  // useEffect for loading data tour
  useEffect(() => {
    dispatch(
      getAllTours({
        page: INIT_PAGE,
        limit: INIT_LIMIT,
      })
    );

    dispatch(
      getAllHotels({
        page: INIT_PAGE,
        limit: INIT_LIMIT,
      })
    );

    // Delay showing content after loading
    // if (!isLoading) {
    //   setTimeout(() => {
    //     setShowContent(true);
    //   }, 1000);
    // }
  }, [dispatch]);

  // useEffect loading info data
  useEffect(() => {
    dispatch(initInfoBeforeReload());
  }, [dispatch]);

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "110px",
        }}
      ></Row>
      <CarouselSlider />
      <Categories />
      <TopTours tours={tours} />
      <TopHotels hotels={hotels} />
      <Plan />
    </>
  );
}
