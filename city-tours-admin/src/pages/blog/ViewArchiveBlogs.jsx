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
import { deleteBlog, getAllBlogs } from "../../features/blog/BlogSlice";
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

const ViewArchiveBlogs = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 5;

  // Redux State
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector((state) => state.blogs?.list);
  const totalPages = useSelector((state) => state.blogs?.totals);
  const currentPage = useSelector((state) => state.blogs?.page);
  const isLoading = useSelector((state) => state.blogs?.isLoading);
  const error = useSelector((state) => state.blogs?.error);

  // Local State
  const [pageSize, setPageSize] = useState(INIT_LIMIT);
  const [pagination, setPagination] = useState({
    page: INIT_PAGE,
    limit: pageSize,
  });
  const [showContent, setShowContent] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAllBlogs(pagination));

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
    });
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);

    setPagination({
      page: INIT_PAGE,
      limit: value,
      search: search,
      status: activeStatus,
    });

    console.log("Change page");
  };

  const handleNavigateViewBlog = (blogId) => {
    navigate(`/admin/blogs/view/${blogId}`);
  };

  const handleNavigateUpdateBlog = (blogId) => {
    navigate(`/admin/blogs/update/${blogId}`);
  };

  const confirm = async (blogId) => {
    try {
      const action = await dispatch(deleteBlog(blogId));

      console.log("action: ", action);

      if (deleteBlog.fulfilled.match(action)) {
        if (action?.payload?.status === 200) {
          notification.success({
            message: "Blog Deletion Confirmation",
            description: "Successfully deleted the blog.",
          });

          dispatch(
            getAllBlogs({
              page: INIT_PAGE,
              limit: INIT_LIMIT,
            })
          );
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Blog Deletion Error",
            description: error,
          });
        }
      } else if (deleteBlog.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Blog Deletion Error",
          description: error,
        });
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      notification.error({
        message: "Blog Deletion Failed",
        description: "Failed to delete the blog.",
      });
    }
  };

  const cancel = (e) => {};

  // Sort by desc
  const sortedBlogs = blogs
    ?.filter((blog) => blog.activeStatus === "IN_ACTIVE")
    .slice()
    .sort((a, b) => b.id - a.id);

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
          Title <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "title",
    },
    {
      title: (
        <>
          Author <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "author",
    },
    {
      title: (
        <>
          Public Date <FontAwesomeIcon icon={faCaretDown} />
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
          Updated Date <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "updatedAt",
      render: (text, record) => {
        const updatedAt = record?.updatedAt;
        if (!updatedAt) return null;

        const dateObject = new Date(updatedAt);
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
            onClick={() => handleNavigateViewBlog(record?.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          {/* <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateUpdateBlog(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button> */}
          {/* 
          <Popconfirm
            title="Archive blog"
            description="Are you sure you want to archive this blog?"
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
                        View Blogs
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
                <Link to="/admin/blogs/create">
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create Blog
                  </CustomText>
                </Link>
              </Button>
            </Col>

            <Col xl={24}>
              <Table
                columns={columns}
                dataSource={sortedBlogs}
                rowKey="id"
                pagination={{
                  pageSize: pagination.limit,
                  total:
                    Math.ceil(totalPages / pagination.limit) * pagination.limit,
                  current: currentPage,
                }}
                onChange={handleTableChange}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewArchiveBlogs;
