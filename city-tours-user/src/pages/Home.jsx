import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllProvinces } from "../features/province/provinceSlice";
import { getAllTours } from "../features/tour/TourSlice";
import { getAllHotels } from "../features/hotel/HotelSlice";
import { initInfoBeforeReload } from "../features/auth/AuthSlice";
import Loading from "../components/common/Loading";
import ProminentHotelAreas from "../components/home/ProminentHotelAreas";
import Search from "../components/home/Search";

export default function Home() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;
  const RATING_DESC = "increment";

  // Redux State
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const provinces = useSelector((state) => state.provinces?.list);
  const tours = useSelector((state) => state.tours?.list);
  const hotels = useSelector((state) => state.hotels?.list);

  // Local State
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data tour
  useEffect(() => {
    // Function to fetch provinces
    const fetchProvinces = () => dispatch(getAllProvinces());

    // Function to fetch tours
    const fetchTours = () =>
      dispatch(
        getAllTours({
          page: INIT_PAGE,
          limit: INIT_LIMIT,
          minPrice: "0",
          maxPrice: "500000000",
          review: "",
          rating: RATING_DESC,
          depart: "",
          startDate: "",
          completed: "false",
        })
      );

    // Function to fetch hotels
    const fetchHotels = () =>
      dispatch(
        getAllHotels({
          page: INIT_PAGE,
          limit: INIT_LIMIT,
          review: "",
          rating: RATING_DESC,
          search: "",
        })
      );

    // Using Promise.all to wait for both requests to complete
    Promise.all([fetchProvinces(), fetchTours(), fetchHotels()])
      .then(() => {
        scrollToTop();
        // Both dispatches are successful
        setTimeout(() => {
          setShowContent(true); // Show content after 1 second delay
        }, 1000);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        // Handle errors here if needed
      });
  }, [dispatch]);

  // useEffect loading info data
  useEffect(() => {
    dispatch(initInfoBeforeReload());
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
          <CarouselSlider />
          <Search />
          <Categories />
          <ProminentHotelAreas provinces={provinces} />
          <TopTours userId={userId} tours={tours} />
          <TopHotels userId={userId} hotels={hotels} />
          <Plan />
        </>
      )}
    </>
  );
}
