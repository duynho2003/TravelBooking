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
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteTour, getAllTours } from "../../features/tour/TourSlice";
import "../../App.css";
import {
  faCaretDown,
  faEye,
  faPen,
  faPenToSquare,
  faStar,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "antd/es/typography/Typography";
import Loading from "../../components/common/Loading";
import CustomText from "../../components/common/CustomText";
import { Link, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const { Text } = Typography;
const { Search } = Input;

const ViewToursCompleted = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;
  const INIT_COMPLETED = "true";

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tours = useSelector((state) => state.tours?.list);
  const totalPages = useSelector((state) => state.tours?.totals);
  const currentPage = useSelector((state) => state.tours?.page);
  const isLoading = useSelector((state) => state.tours?.isLoading);
  const error = useSelector((state) => state.tours?.error);

  console.log("tours: ", tours);

  // Local State
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    search: search,
    status: activeStatus,
    completed: INIT_COMPLETED,
  });
  // const [isModalOpenChangeStatus, setIsModalOpenChangeStatus] = useState(false);
  // const [selectedUserId, setSelectedUserId] = useState(null);
  // const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  // const [loadingButton, setLoadingButton] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllTours(pagination));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      search: search,
      status: activeStatus,
      completed: INIT_COMPLETED,
    });

    console.log("Next page");
    console.log("search: ", search);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);

    setPagination({
      page: INIT_PAGE,
      limit: value,
      search: search,
      status: activeStatus,
      completed: INIT_COMPLETED,
    });

    console.log("Change page");
  };

  const handleNavigateViewTour = (tourId) => {
    navigate(`/admin/tours/view/${tourId}`);
  };

  const handleNavigateUpdateTour = (tourId) => {
    navigate(`/admin/tours/update/${tourId}`);
  };

  const confirm = async (tourId) => {
    try {
      const action = await dispatch(deleteTour(tourId));

      console.log("action: ", action);

      if (deleteTour.fulfilled.match(action)) {
        if (action?.payload?.status === 200) {
          notification.success({
            message: "Tour Deletion Confirmation",
            description: "Successfully deleted the tour.",
          });

          dispatch(
            getAllTours({
              page: INIT_PAGE,
              limit: INIT_LIMIT,
              search: "",
              status: "",
            })
          );
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Tour Deletion Error",
            description: error,
          });
        }
      } else if (deleteTour.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Tour Deletion Error",
          description: error,
        });
      }
    } catch (error) {
      console.error("Error deleting tour:", error);
      notification.error({
        message: "Tour Deletion Failed",
        description: "Failed to delete the tour.",
      });
    }
  };

  const cancel = (e) => {};

  // Sort by desc
  const sortedTours = tours?.slice()?.sort((a, b) => {
    return b.id - a.id;
  });

  console.log("sortedTours: ", sortedTours);

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
          Code <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "code",
    },
    {
      title: (
        <>
          Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "name",
      render: (text) => <div className="truncated-text">{text}</div>,
    },
    {
      title: (
        <>
          Tour End Time <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "tourTimes",
      render: (tourTimes) => {
        if (!tourTimes || tourTimes.length === 0) {
          return "N/A";
        }

        // Get the current date
        const currentDate = new Date();

        // Filter tourTimes to only include dates after the current date
        const futureTourTimes = tourTimes.filter((tourTime) => {
          const startDate = new Date(
            tourTime.startDate.split(" - ")[1].split("/").reverse().join("-")
          );
          return startDate < currentDate;
        });

        if (futureTourTimes.length === 0) {
          return "No new tour time";
        }

        // Find the nearest start date from futureTourTimes
        const nearestTourTime = futureTourTimes.reduce((nearest, current) => {
          const nearestStartDate = new Date(
            nearest.startDate.split(" - ")[1].split("/").reverse().join("-")
          );
          const currentStartDate = new Date(
            current.startDate.split(" - ")[1].split("/").reverse().join("-")
          );

          return currentStartDate < nearestStartDate ? current : nearest;
        });

        return nearestTourTime.startDate;
      },
    },
    {
      title: (
        <>
          Rating <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "rating",
      render: (rating) => {
        return (
          <Text>
            {rating}{" "}
            <FontAwesomeIcon
              icon={faStar}
              style={{
                color: "var(--yellow)",
              }}
            />
          </Text>
        );
      },
    },
    {
      title: (
        <>
          Price / Person <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "priceAdult",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },

    {
      title: (
        <>
          Customer Booking <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "quantityCustomerBooking",
    },
    {
      title: (
        <>
          Actions <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "actions",
      render: (text, record) => (
        <>
          <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateViewTour(record?.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          {/* <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateUpdateTour(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>

          <Popconfirm
            title="Delete tour"
            description="Are you sure you want to delete this tour?"
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
            onConfirm={() => confirm(record?.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              style={{
                color: "var(--gray-light)",
              }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </Popconfirm> */}
        </>
      ),
    },
  ];

  const onSearch = (value) => {
    console.log(value);

    setPagination((prev) => ({
      ...prev,
      search: value,
      page: INIT_PAGE,
    }));

    setSearch(value);
  };

  const onChangeDate = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      date: value,
      page: INIT_PAGE,
    }));
  };

  const onChangeStatus = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      status: value,
      page: INIT_PAGE,
    }));

    setActiveStatus(value);
  };

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
                        View Tours
                      </CustomText>
                    ),
                  },
                ]}
              />

              <Button
                style={{
                  background: "var(--green-dark)",
                  border: "var(--green-dark)",
                }}
              >
                <Link to="/admin/tours/create">
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create Tour
                  </CustomText>
                </Link>
              </Button>
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
                placeholder="Search name and address"
                onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />

              {/* <Select
                onChange={onChangeRole}
                style={{
                  width: "150px",
                }}
                defaultValue={""}
              >
                <Option value={""}>All Role</Option>
                <Option value={"ROLE_ADMIN"}>Admin</Option>
                <Option value={"ROLE_STAFF"}>Staff</Option>
                <Option value={"ROLE_CUSTOMER"}>Customer</Option>
              </Select> */}

              <Select
                onChange={onChangeStatus}
                style={{
                  width: "150px",
                }}
                defaultValue={""}
              >
                <Option value={""}>All Status</Option>
                <Option value={"ACTIVE"}>Active</Option>
                <Option value={"IN_ACTIVE"}>In Active</Option>
              </Select>
            </Col>

            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedTours}
                rowKey="id"
                pagination={{
                  pageSize: pagination.limit,
                  total:
                    Math.ceil(totalPages / pagination.limit) * pagination.limit,
                  current: currentPage,
                }}
                onChange={handleTableChange}
              />

              {/* <Row justify="end">
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
              </Row> */}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewToursCompleted;
