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
  faPrint,
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
import {
  getAllRoomBookings,
  getAllTourBookings,
} from "../../features/tourBooking/TourBookingSlice";
import { getAllHotels } from "../../features/hotel/HotelSlice";
import Cookies from "js-cookie";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ViewRoomBookings = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hotels = useSelector((state) => state.hotels?.list);
  const roomBookings = useSelector(
    (state) => state.tourBookings?.roomBookingsList
  );
  const totalPages = useSelector((state) => state.tourBookings?.totals);
  const currentPage = useSelector((state) => state.tourBookings?.page);
  const isLoading = useSelector((state) => state.tourBookings?.loading);
  const error = useSelector((state) => state.tourBookings?.error);

  // Local State
  const [hotelName, setHotelName] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    hotelName: hotelName,
    hotelId: hotelId,
  });
  const [showContent, setShowContent] = useState(false);
  const [uniqueHotelNames, setUniqueHotelNames] = useState([]);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllRoomBookings(pagination));

    dispatch(
      getAllHotels({
        page: 1,
        limit: 10,
        search: "",
      })
    );

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const uniqueNamesSet = new Set();

      const addedHotelIds = [];

      hotels.forEach((hotel) => {
        if (!addedHotelIds.includes(hotel.id)) {
          uniqueNamesSet.add({
            hotelId: hotel.id,
            hotelName: hotel.name,
          });
          addedHotelIds.push(hotel.id);
        }
      });

      const uniqueNamesArray = Array.from(uniqueNamesSet);

      setUniqueHotelNames(uniqueNamesArray);
    }
  }, [hotels]);

  // Event Handlers
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      hotelName: hotelName,
      hotelId: hotelId,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
      hotelName: hotelName,
      hotelId: hotelId,
    });
  };

  // Sort by desc
  const sortedRoomBookings = roomBookings?.slice().sort((a, b) => {
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

  const updateBookingStatus = async (roomBookingId, newStatus) => {
    try {
      const token = Cookies.get("token");

      await axios.patch(
        `http://localhost:5050/api/v1/roomBookings/update-status/${roomBookingId}`,
        {
          bookingStatus: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      notification.success({
        message: "Booking status updated successfully!",
        description: "Booking status updated successfully!",
      });
      dispatch(getAllTourBookings(pagination));
    } catch (error) {
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
      console.error(error);
    }
  };

  const handleStatusChange = (value, record) => {
    updateBookingStatus(record.id, value);
  };

  const printInvoice = (record) => {
    const doc = new jsPDF("p", "mm", "a4");

    // Thêm tiêu đề
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("BILL HOTEL BOOKING", 105, 20, { align: "center" });

    // Thông tin hóa đơn
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Hotel Name: ${record.hotelName || "N/A"}`, 10, 30);
    doc.text(
      `Price: ${new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(record.price || 0)}`,
      10,
      50
    );
    doc.text(
      `Start Date: ${
        new Date(record.startDate).toLocaleString("vi-VN") || "N/A"
      }`,
      10,
      60
    );
    doc.text(
      `End Date: ${new Date(record.endDate).toLocaleString("vi-VN") || "N/A"}`,
      10,
      70
    );
    doc.text(
      `Booking Date: ${
        new Date(record.createdAt).toLocaleString("vi-VN") || "N/A"
      }`,
      10,
      80
    );
    doc.text(
      `Booking Status: ${
        record.bookingStatus
          ? record.bookingStatus.charAt(0).toUpperCase() +
            record.bookingStatus.slice(1).toLowerCase()
          : "N/A"
      }`,
      10,
      90
    );

    // Tạo bảng
    const tableData = [
      ["Hotel Name", record.hotelName || "N/A"],
      [
        "Price",
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.price || 0),
      ],
      [
        "Start Date",
        new Date(record.startDate).toLocaleString("vi-VN") || "N/A",
      ],
      ["End Date", new Date(record.endDate).toLocaleString("vi-VN") || "N/A"],
      [
        "Booking Date",
        new Date(record.createdAt).toLocaleString("vi-VN") || "N/A",
      ],
      [
        "Booking Status",
        record.bookingStatus
          ? record.bookingStatus.charAt(0).toUpperCase() +
            record.bookingStatus.slice(1).toLowerCase()
          : "N/A",
      ],
    ];

    doc.autoTable({
      startY: 100,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "striped",
      styles: { fontSize: 10 },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
      },
    });

    // Lưu file PDF
    doc.save(`invoice_${record.id}.pdf`);
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
          Hotel Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "hotelName",
      render: (text) => <div className="truncated-text">{text}</div>,
    },
    {
      title: (
        <>
          Start Date <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "startDate",
    },
    {
      title: (
        <>
          End Date <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "endDate",
    },
    {
      title: (
        <>
          Price <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "price",
      render: (text, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record?.price),
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
      render: (bookingStatus, record) => {
        const isPending = bookingStatus === "PENDING";
        const options = isPending
          ? ["PENDING", "SUCCESS", "FAILED"]
          : [bookingStatus];

        return (
          <Select
            defaultValue={bookingStatus}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(value, record)}
          >
            {options.map((status) => (
              <Option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </Option>
            ))}
          </Select>
        );
      },
    },

    {
      title: (
        <>
          Actions <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record, index) => (
        <>
          <Button
            onClick={() => printInvoice(record)}
            icon={<FontAwesomeIcon icon={faPrint} />}
          >
            Print Invoice
          </Button>
        </>
      ),
    },
  ];

  const onSearch = (value) => {
    console.log(value);

    setPagination((prev) => ({
      ...prev,
      hotelName: value,
      page: INIT_PAGE,
    }));

    setHotelName(value);
  };

  const onChangeHotel = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      hotelId: value,
      page: INIT_PAGE,
    }));

    setHotelId(value);
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
                        View Room Bookings
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
                placeholder="Search hotel name"
                onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />

              <Select
                onChange={onChangeHotel}
                style={{
                  width: "300px",
                }}
                defaultValue={""}
              >
                <Option value={""}>All Hotels</Option>
                {uniqueHotelNames.map((hotel) => (
                  <Option key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.hotelName}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedRoomBookings}
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

              {/* Modal hiển thị form duyệt đơn đăng ký giáo viên */}
              {/* <Modal
                title="Change status user"
                footer={null}
                open={isModalOpenChangeStatus}
                onOk={handleOkChangeStatus}
                onCancel={handleCancelChangeStatus}
              >
                <Col xs={22} sm={20} md={16} lg={12} xl={24}>
                  <Form onFinish={onSubmit} layout="vertical">
                    <Form.Item label="User Id">
                      <Input value={selectedUserId} disabled />
                    </Form.Item>

                    <Form.Item label="Status">
                      <Select
                        value={selectedUserStatus}
                        onChange={(value) => setSelectedUserStatus(value)}
                      >
                        <Option value="ACTIVE">ACTIVE</Option>
                        <Option value="IN_ACTIVE">IN ACTIVE</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <Button
                        htmlType="submit"
                        style={{
                          background: "var(--blue-light)",
                          color: "var(--white)",
                          marginTop: "20px",
                          width: "100%",
                        }}
                        icon={loadingButton ? <Spin /> : null}
                        loading={loadingButton}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Modal> */}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewRoomBookings;
