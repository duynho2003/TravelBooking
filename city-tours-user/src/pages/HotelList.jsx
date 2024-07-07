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
import List from "../components/hotel/List";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";

export default function HotelList() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hotels = useSelector((state) => state.hotels?.list);
  const totalPages = useSelector((state) => state.hotels?.totals);
  const currentPage = useSelector((state) => state.hotels?.page);
  const isLoading = useSelector((state) => state.hotels?.loading);
  const error = useSelector((state) => state.hotels?.error);

  // Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    // minPrice: "0",
    // maxPrice: "5000000",
    review: "",
  });
  const [showContent, setShowContent] = useState(false);

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  // const initialMinPrice = urlSearchParams.get("minPrice");
  // const initialMaxPrice = urlSearchParams.get("maxPrice");
  const initialReview = urlSearchParams.get("review");

  useEffect(() => {
    setPagination((prevState) => ({
      ...prevState,
      // minPrice: initialMinPrice,
      // maxPrice: initialMaxPrice,
      review: initialReview,
    }));
  }, [initialReview]);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllHotels(pagination))
      .then(() => {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);

        scrollToTop();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [dispatch, pagination]);

  const handleTableChange = (current, pageSize, review) => {
    setShowContent(false);

    scrollToTop();

    setPagination({
      ...pagination,
      page: current,
      limit: pageSize,
      // minPrice: minPrice,
      // maxPrice: maxPrice,
      review: review,
    });

    // urlSearchParams.set("minPrice", minPrice);
    // urlSearchParams.set("maxPrice", maxPrice);
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
            hotels={hotels}
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
