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
import { getAllRegions } from "../../features/region/RegionSlice";
import "../../App.css";
import {
  faCaretDown,
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
import { userRoles } from "../../utils/enums/UserRoles";
import { userStatus } from "../../utils/enums/UserStatus";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ViewRegions = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const regions = useSelector((state) => state.regions?.list);
  const totalPages = useSelector((state) => state.regions?.totals);
  const currentPage = useSelector((state) => state.regions?.page);
  const isLoading = useSelector((state) => state.regions?.loading);
  const error = useSelector((state) => state.regions?.error);

  // Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
  });
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllRegions(pagination));

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
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
    });
  };

  const handleNavigateUpdateRegion = (regionId) => {
    navigate(`/admin/regions/update/${regionId}`);
  };

  // Sort by desc
  const sortedRegions = regions?.slice().sort((a, b) => {
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
    },
    {
      title: (
        <>
          Provinces <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "provinces",
      render: (provinces) => (
        <>
          {provinces.map((province, index) => (
            <span key={province.id}>
              <Button
                style={{
                  marginRight: 5,
                }}
              >
                {/* <img
                  src={province.thumbnail}
                  alt={province.name}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                /> */}
                {province.name}
              </Button>
            </span>
          ))}
        </>
      ),
    },
    // {
    //   title: (
    //     <>
    //       Role <FontAwesomeIcon icon={faCaretDown} />
    //     </>
    //   ),
    //   dataIndex: "roles",
    //   render: (roles) => (
    //     <>
    //       {roles.map((role, index) => {
    //         let color, tagText;
    //         switch (role) {
    //           case "ROLE_ADMIN":
    //             color = "red";
    //             tagText = "Admin";
    //             break;
    //           case "ROLE_CUSTOMER":
    //             color = "blue";
    //             tagText = "Customer";
    //             break;
    //           case "ROLE_STAFF":
    //             color = "green";
    //             tagText = "Staff";
    //             break;
    //           default:
    //             color = "default";
    //             tagText = "Không xác định";
    //         }
    //         return (
    //           <Tag color={color} key={index}>
    //             {tagText}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    // {
    //   title: (
    //     <>
    //       Status <FontAwesomeIcon icon={faCaretDown} />
    //     </>
    //   ),
    //   dataIndex: "status",
    //   render: (_, { status }) => {
    //     let color = status === "ACTIVE" ? "cyan" : "volcano";

    //     let tagText =
    //       status === "ACTIVE"
    //         ? "Active"
    //         : status === "IN_ACTIVE"
    //         ? "In Active"
    //         : status;

    //     return (
    //       <Tag color={color} key={status}>
    //         {tagText}
    //       </Tag>
    //     );
    //   },
    // },
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
            onClick={() => handleNavigateUpdateRegion(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>

          {/* <Popconfirm
            title="Delete user"
            description="Are you sure to delete this user?"
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
                        View Regions
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
                <Link to="/admin/regions/create">
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create Region
                  </CustomText>
                </Link>
              </Button>
            </Col>

            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedRegions}
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
                    <Option value={6}>6 / page</Option>
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

export default ViewRegions;
