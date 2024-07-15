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

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ViewTransactions = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const transactions = useSelector((state) => state.transactions?.list);
  const totalPages = useSelector((state) => state.transactions?.totals);
  const currentPage = useSelector((state) => state.transactions?.page);
  const isLoading = useSelector((state) => state.transactions?.loading);
  const error = useSelector((state) => state.transactions?.error);

  // Local State
  const [search, setSearch] = useState("");
  const [payment, setPayment] = useState("");
  // const [activeStatus, setActiveStatus] = useState("");

  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    search: search,
    payment: payment,
    // status: activeStatus,
  });
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllTransactions(pagination));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  // Event Handlers
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      search: search,
      payment: payment,
      // status: activeStatus,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
      search: search,
      payment: payment,
      // status: activeStatus,
    });
  };

  // Sort by desc
  const sortedTransactions = transactions?.slice().sort((a, b) => {
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
          Code <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "code",
    },
    {
      title: (
        <>
          Type <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "type",
    },

    {
      title: (
        <>
          Bank Code <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "bankCode",
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
        }).format(record?.amount / 100),
    },

    {
      title: (
        <>
          Pay Date <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "payDate",
      render: (text, record) => formatPayDate(record?.payDate),
    },

    {
      title: (
        <>
          Payment Status <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "paymentStatus",
      render: (paymentStatus) => {
        let color, tagText;
        switch (paymentStatus) {
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
    {
      title: (
        <>
          Transaction Status <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "transactionStatus",
      render: (transactionStatus) => {
        let color, tagText;
        switch (transactionStatus) {
          case "FAILED":
            color = "red";
            tagText = "Failed";
            break;
          case "PROCESSING":
            color = "blue";
            tagText = "Processing";
            break;
          case "COMPLETED":
            color = "green";
            tagText = "Completed";
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
      search: value,
      page: INIT_PAGE,
    }));

    setSearch(value);
  };

  const onChangePaymentStatus = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      payment: value,
      page: INIT_PAGE,
    }));

    setPayment(value);

    console.log(pagination);
  };

  // const onChangeStatus = (value) => {
  //   console.log(value);
  //   setPagination((prev) => ({
  //     ...prev,
  //     status: value,
  //     page: INIT_PAGE,
  //   }));

  //   setActiveStatus(value);
  // };

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
                        View Transactions
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
                placeholder="Search code"
                onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />

              <Select
                onChange={onChangePaymentStatus}
                style={{
                  width: "200px",
                }}
                defaultValue={""}
              >
                <Option value={""}>All Payment Status</Option>
                <Option value={"PENDING"}>Pending</Option>
                <Option value={"SUCCESS"}>Success</Option>
                <Option value={"FAILED"}>Failed</Option>
              </Select>

              {/*
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
              </Select> */}
            </Col>
            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedTransactions}
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

export default ViewTransactions;
