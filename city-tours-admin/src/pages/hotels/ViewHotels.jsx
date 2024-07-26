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
import { getAllHotels } from "../../features/hotel/HotelSlice";
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

const { Option } = Select;
const { Text } = Typography;
const { Search } = Input;

const ViewHotels = () => {
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
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    search: search,
  });
  // const [isModalOpenChangeStatus, setIsModalOpenChangeStatus] = useState(false);
  // const [selectedUserId, setSelectedUserId] = useState(null);
  // const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  // const [loadingButton, setLoadingButton] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllHotels(pagination));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  // Event Handlers
  // const showModalOpenChangeStatus = (userId, status) => {
  //   setSelectedUserId(userId);
  //   setSelectedUserStatus(status);
  //   setIsModalOpenChangeStatus(true);
  // };

  // const handleOkChangeStatus = () => {
  //   setIsModalOpenChangeStatus(false);
  // };

  // const handleCancelChangeStatus = () => {
  //   setSelectedUserId(null);
  //   setSelectedUserStatus(null);
  //   setIsModalOpenChangeStatus(false);
  // };

  // const onSubmit = async () => {
  //   const data = {
  //     userId: selectedUserId,
  //     status: selectedUserStatus,
  //   };

  //   setLoadingButton(true);

  //   try {
  //     const response = await dispatch(changeStatusAccount(data));

  //     handleChangeStatusAccountResponse(response);

  //     dispatch(getAllAcounts(pagination));
  //   } catch (error) {
  //     notification.error({
  //       message: "Lỗi hệ thống",
  //       description:
  //         "Máy chủ không thực hiện được yêu cầu hợp lệ do lỗi với máy chủ.",
  //     });
  //   } finally {
  //     setLoadingButton(false);
  //   }
  // };

  // const handleChangeStatusAccountResponse = (response) => {
  //   console.log("response: ", response);
  //   if (response.type === changeStatusAccount.fulfilled.toString()) {
  //     if (response?.payload?.status) {
  //       setIsModalOpenChangeStatus(false);
  //       notification.success({
  //         message: "Xét duyệt đơn đăng ký",
  //         description: "Xét duyệt đơn đăng ký tài khoản giáo viên thành công.",
  //       });
  //     } else {
  //       const error =
  //         response?.payload?.error?.message || "Lỗi không xác định.";
  //       notification.error({
  //         message: "Lỗi duyệt đơn đăng ký",
  //         description: error,
  //       });
  //     }
  //   } else if (response.type === changeStatusAccount.rejected.toString()) {
  //     const error = response?.payload?.error?.message || "Lỗi không xác định.";
  //     notification.error({
  //       message: "Lỗi duyệt đơn đăng ký",
  //       description: error,
  //     });
  //   }
  // };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      search: search,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
      search: search,
    });
  };

  const handleNavigateViewHotel = (hotelId) => {
    navigate(`/admin/hotels/view/${hotelId}`);
  };

  const handleNavigateUpdateHotel = (hotelId) => {
    navigate(`/admin/hotels/update/${hotelId}`);
  };

  // Sort by desc
  const sortedHotels = hotels?.slice().sort((a, b) => {
    return b.id - a.id;
  });

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
          Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "name",
      className: "truncated-text",
    },
    {
      title: (
        <>
          Address <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "address",
      className: "truncated-text",
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
          Created At <FontAwesomeIcon icon={faCaretDown} />
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
          Status <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "activeStatus",
      render: (_, { activeStatus }) => {
        let color = activeStatus === "ACTIVE" ? "cyan" : "volcano";

        let tagText =
          activeStatus === "ACTIVE"
            ? "Active"
            : activeStatus === "IN_ACTIVE"
            ? "In Active"
            : activeStatus;

        return (
          <Tag color={color} key={activeStatus}>
            {tagText}
          </Tag>
        );
      },
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
            onClick={() => handleNavigateViewHotel(record?.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateUpdateHotel(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>

          {/* <Popconfirm
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
                        View Hotels
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
                <Link to="/admin/hotels/create">
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create Hotel
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
            </Col>
            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedHotels}
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

export default ViewHotels;
