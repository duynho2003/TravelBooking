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
import { deleteAccount, getAllAcounts } from "../../features/users/UserSlice";
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

const ViewUsers = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users?.list);
  const totalPages = useSelector((state) => state.users?.totals);
  const currentPage = useSelector((state) => state.users?.page);
  const isLoading = useSelector((state) => state.users?.loading);
  const error = useSelector((state) => state.users?.error);

  // Local State
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
    search: search,
    role: role,
    status: activeStatus,
  });
  const [isModalOpenChangeStatus, setIsModalOpenChangeStatus] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllAcounts(pagination));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch, pagination]);

  // Event Handlers
  const showModalOpenChangeStatus = (userId, status) => {
    setSelectedUserId(userId);
    setSelectedUserStatus(status);
    setIsModalOpenChangeStatus(true);
  };

  const handleOkChangeStatus = () => {
    setIsModalOpenChangeStatus(false);
  };

  const handleCancelChangeStatus = () => {
    setSelectedUserId(null);
    setSelectedUserStatus(null);
    setIsModalOpenChangeStatus(false);
  };

  const onSubmit = async () => {
    const data = {
      userId: selectedUserId,
      status: selectedUserStatus,
    };

    setLoadingButton(true);

    try {
      const response = await dispatch(changeStatusAccount(data));

      handleChangeStatusAccountResponse(response);

      dispatch(getAllAcounts(pagination));
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description:
          "Máy chủ không thực hiện được yêu cầu hợp lệ do lỗi với máy chủ.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleChangeStatusAccountResponse = (response) => {
    console.log("response: ", response);
    if (response.type === changeStatusAccount.fulfilled.toString()) {
      if (response?.payload?.status) {
        setIsModalOpenChangeStatus(false);
        notification.success({
          message: "Xét duyệt đơn đăng ký",
          description: "Xét duyệt đơn đăng ký tài khoản giáo viên thành công.",
        });
      } else {
        const error =
          response?.payload?.error?.message || "Lỗi không xác định.";
        notification.error({
          message: "Lỗi duyệt đơn đăng ký",
          description: error,
        });
      }
    } else if (response.type === changeStatusAccount.rejected.toString()) {
      const error = response?.payload?.error?.message || "Lỗi không xác định.";
      notification.error({
        message: "Lỗi duyệt đơn đăng ký",
        description: error,
      });
    }
  };

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    setPagination({
      page: current,
      limit: pageSize,
      search: search,
      role: role,
      status: activeStatus,
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPagination({
      page: INIT_PAGE,
      limit: value,
      search: search,
      role: role,
      status: activeStatus,
    });
  };

  const handleNavigateUpdateUser = (userId) => {
    navigate(`/admin/users/update/${userId}`);
  };

  // Sort by desc
  const sortedUsers = users?.slice().sort((a, b) => {
    return b.id - a.id;
  });

  const confirm = async (userId) => {
    try {
      await dispatch(deleteAccount(userId));

      notification.success({
        message: "User Deletion Confirmation",
        description: "Successfully deleted the user account.",
      });

      dispatch(getAllAcounts(pagination));
    } catch (error) {
      // Xử lý lỗi nếu cần thiết
      console.error("Error deleting user:", error);

      notification.error({
        message: "User Deletion Failed",
        description: "Failed to delete the user account.",
      });
    }
  };

  const cancel = (e) => {};

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
          Username <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "username",
    },
    {
      title: (
        <>
          Email <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "email",
    },
    {
      title: (
        <>
          Role <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "roles",
      render: (roles) => (
        <>
          {roles.map((role, index) => {
            let color, tagText;
            switch (role) {
              case "ROLE_ADMIN":
                color = "red";
                tagText = "Admin";
                break;
              case "ROLE_CUSTOMER":
                color = "blue";
                tagText = "Customer";
                break;
              case "ROLE_STAFF":
                color = "green";
                tagText = "Staff";
                break;
              default:
                color = "default";
                tagText = "Không xác định";
            }
            return (
              <Tag color={color} key={index}>
                {tagText}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: (
        <>
          Status <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "status",
      render: (_, { status }) => {
        let color = status === "ACTIVE" ? "cyan" : "volcano";

        let tagText =
          status === "ACTIVE"
            ? "Active"
            : status === "IN_ACTIVE"
            ? "Disabled"
            : status;

        return (
          <Tag color={color} key={status}>
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
            onClick={() => handleNavigateUpdateUser(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>

          <Popconfirm
            title="Block user"
            description="Are you sure to block this user?"
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
          </Popconfirm>
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

  const onChangeRole = (value) => {
    console.log(value);
    setPagination((prev) => ({
      ...prev,
      role: value,
      page: INIT_PAGE,
    }));

    setRole(value);
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
                        View Users
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
                placeholder="Search username and email"
                onSearch={onSearch}
                style={{
                  width: 300,
                }}
              />

              <Select
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
              </Select>

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
                dataSource={sortedUsers}
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
              <Modal
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
              </Modal>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewUsers;
