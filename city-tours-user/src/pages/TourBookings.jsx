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
import List from "../components/tourBookings/List";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import {
  getAllRoomBookingsByUserId,
  getAllTourBookingsByUserId,
} from "../features/booking/BookingSlice";

export default function TourBookings() {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth?.info?.id);
  const tourBookings = useSelector((state) => state.bookings?.tourBookingsList);
  const totalPages = useSelector((state) => state.bookings?.totals);
  const currentPage = useSelector((state) => state.bookings?.page);
  const isLoading = useSelector((state) => state.bookings?.loading);
  const error = useSelector((state) => state.bookings?.error);

  console.log("userId: ", userId);

  // Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    userId: userId,
    page: INIT_PAGE,
    limit: pageSize,
  });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Update pagination khi userId thay đổi
    setPagination((prev) => ({
      ...prev,
      userId: userId,
    }));
  }, [userId]);

  // useEffect for loading data
  useEffect(() => {
    if (pagination && pagination.userId) {
      dispatch(getAllTourBookingsByUserId(pagination))
        .then(() => {
          setTimeout(() => {
            setShowContent(true);
          }, 1000);

          scrollToTop();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }, [dispatch, pagination]);

  const handleTableChange = (current, pageSize) => {
    setShowContent(false);

    scrollToTop();

    setPagination({
      ...pagination,
      page: current,
      limit: pageSize,
    });
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
            tourBookings={tourBookings}
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
