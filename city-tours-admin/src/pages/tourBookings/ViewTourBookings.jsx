import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../features/transaction/TransactionSlice";
import "../../App.css";
import {
  faCaretDown,
  faEye,
  faPen,
  faPenToSquare,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "antd/es/typography/Typography";
import Loading from "../../components/common/Loading";
import CustomText from "../../components/common/CustomText";
import { Link, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { paymentStatus } from "../../utils/enums/PaymentStatus";
import { transactionStatus } from "../../utils/enums/TransactionStatus";
import { getAllTourBookings } from "../../features/tourBooking/TourBookingSlice";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ViewTourBookings = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tourBookings = useSelector((state) => state.tourBookings?.list);
  const totalPages = useSelector((state) => state.tourBookings?.totals);
  const currentPage = useSelector((state) => state.tourBookings?.page);
  const isLoading = useSelector((state) => state.tourBookings?.loading);
  const error = useSelector((state) => state.tourBookings?.error);

  // Local State
  const [tourName, setTourName] = useState("");
  const [tourId, setTourId] = useState("");
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    tourName: tourName,
    tourId: tourId,
  });
  const [showContent, setShowContent] = useState(false);
  const [uniqueTourNames, setUniqueTourNames] = useState([]);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllTourBookings(pagination));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  useEffect(() => {
    if (tourBookings && tourBookings.length > 0) {
      // Create a Set to store unique tour names
      const uniqueNamesSet = new Set();

      const addedTourIds = []; // Array to keep track of added tourIds

      // Iterate over tourBookings and add unique tour objects to the Set
      tourBookings.forEach((tourBooking) => {
        // Check if tourId is already added
        if (!addedTourIds.includes(tourBooking.tourId)) {
          uniqueNamesSet.add({
            tourId: tourBooking.tourId,
            tourName: tourBooking.tourName,
          });
          addedTourIds.push(tourBooking.tourId); // Add tourId to the addedTourIds array
        }
      });

      // Convert Set back to array
      const uniqueNamesArray = Array.from(uniqueNamesSet);

      // Update state with unique tour names
      setUniqueTourNames(uniqueNamesArray);
    }
  }, [tourBookings]);

  console.log("tourBookings: ", tourBookings);

  // Event Handlers
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      tourName: tourName,
      tourId: tourId,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
      tourName: tourName,
      tourId: tourId,
    });
  };

  // Sort by desc
  const sortedTourBookings = tourBookings?.slice()?.sort((a, b) => {
    return b.id - a.id;
  });

  const formatPayDate = (payDate) => {
    if (!payDate) return "";

    const year = payDate.slice(0, 4);
    const month = payDate.slice(4, 6);
    const day = payDate.slice(6, 8);
    const hours = payDate.slice(8, 10);
    const minutes = payDate.slice(10, 12);
    const seconds = payDate.slice(12, 14);

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const columns = [
    {
      title: (
        <>
          STT <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record, index) => index + 1,
    },
    {
      title: (
        <>
          Tour Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "tourName",
      render: (text) => <div className="truncated-text">{text}</div>,
    },
    {
      title: (
        <>
          Customer Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "customerName",
    },
    {
      title: (
        <>
          Amount <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "amount",
      render: (text, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record?.amount),
    },

    {
      title: (
        <>
          Booking Date <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "createdAt",
      render: (text, record) => {
        const createdAt = record?.createdAt;
        if (!createdAt) return null;

        const dateObject = new Date(createdAt);
        const formattedDate = dateObject.toLocaleString("vi-VN");

        return formattedDate;
      },
    },

    {
      title: (
        <>
          Booking Status <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "bookingStatus",
      render: (bookingStatus) => {
        let color, tagText;
        switch (bookingStatus) {
          case "FAILED":
            color = "red";
            tagText = "Failed";
            break;
          case "PENDING":
            color = "blue";
            tagText = "Pending";
            break;
          case "SUCCESS":
            color = "green";
            tagText = "Success";
            break;
          default:
            color = "default";
            tagText = "Không xác định";
        }
        return <Tag color={color}>{tagText}</Tag>;
      },
    },
  ];

  const onSearch = (value) => {
    console.log(value);

    setPagination((prev) => ({
      ...prev,
      tourName: value,
      page: INIT_PAGE,
    }));

    setTourName(value);
  };

  const onChangeTour = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      tourId: value,
      page: INIT_PAGE,
    }));

    setTourId(value);
  };

  console.log("pagination: ", pagination);

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

      {/* Show content */}
      {showContent && (
        <>
          <Row
            style={{
              padding: "20px",
              background: "var( --white)",
              borderRadius: "8px",
            }}
          >
            <Col
              xl={24}
              style={{
                padding: "0 0 20px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Breadcrumb
                items={[
                  {
                    title: (
                      <CustomText
                        size={"18px"}
                        weight={"500"}
                        color={"var(--black-text)"}
                        isButton={true}
                      >
                        View Tour Bookings
                      </CustomText>
                    ),
                  },
                ]}
              />

              {/* <Button
                style={{
                  background: "var(--green-dark)",
                  border: "var(--green-dark)",
                }}
              >
                <Link to="/admin/users/create">
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create User
                  </CustomText>
                </Link>
              </Button> */}
            </Col>

            <Col
              xl={24}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "0 0 20px 0",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <Search
                placeholder="Search tour name"
                onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />

              <Select
                onChange={onChangeTour}
                style={{
                  width: "300px",
                }}
                defaultValue={""}
              >
                <Option value={""}>All Tours</Option>
                {uniqueTourNames.map((tour) => (
                  <Option key={tour.tourId} value={tour.tourId}>
                    {tour.tourName}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedTourBookings}
                rowKey="id"
                pagination={{
                  pageSize: pagination.limit,
                  total:
                    Math.ceil(totalPages / pagination.limit) * pagination.limit,
                  current: currentPage,
                }}
                onChange={handleTableChange}
              />

              <Row justify="end">
                <Col
                  style={{
                    marginTop: "4px",
                    marginRight: "10px",
                  }}
                >
                  <Text>The total number of lines per page:</Text>
                </Col>
                <Col>
                  <Select
                    defaultValue={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <Option value={1}>1 / page</Option>
                    <Option value={2}>2 / page</Option>
                    <Option value={3}>3 / page</Option>
                    <Option value={4}>4 / page</Option>
                    <Option value={5}>5 / page</Option>
                  </Select>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewTourBookings;
