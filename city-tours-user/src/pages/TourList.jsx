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
import List from "../components/tour/List";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";

export default function TourList() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tours = useSelector((state) => state.tours?.list);
  const totalPages = useSelector((state) => state.tours?.totals);
  const currentPage = useSelector((state) => state.tours?.page);
  const isLoading = useSelector((state) => state.tours?.loading);
  const error = useSelector((state) => state.tours?.error);

  // Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    minPrice: "0",
    maxPrice: "5000000",
    review: "",
  });
  const [showContent, setShowContent] = useState(false);

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const initialMinPrice = urlSearchParams.get("minPrice");
  const initialMaxPrice = urlSearchParams.get("maxPrice");
  const initialReview = urlSearchParams.get("review");

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      minPrice: initialMinPrice,
      maxPrice: initialMaxPrice,
      review: initialReview,
    }));
  }, [initialMinPrice, initialMaxPrice, initialReview]);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllTours(pagination))
      .then(() => {
        scrollToTop();

        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch, pagination]);

  const handleTableChange = (current, pageSize, minPrice, maxPrice, review) => {
    setShowContent(false);

    scrollToTop();

    setPagination({
      ...pagination,
      page: current,
      limit: pageSize,
      minPrice: minPrice,
      maxPrice: maxPrice,
      review: review,
    });

    urlSearchParams.set("minPrice", minPrice);
    urlSearchParams.set("maxPrice", maxPrice);
    urlSearchParams.set("review", review);

    navigate(`${location.pathname}?${urlSearchParams.toString()}`);
  };

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
          <List
            tours={tours}
            totalPages={totalPages}
            currentPage={currentPage}
            pagination={pagination}
            handleTableChange={handleTableChange}
          />
        </>
      )}
    </>
  );
}
