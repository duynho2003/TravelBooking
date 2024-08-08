import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  notification,
  DatePicker,
  Table,
  Collapse,
  TimePicker,
  Typography,
  Image,
  InputNumber,
  Timeline,
  Modal,
  Card,
  Tag,
  List,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import { getTourById, tourRoomBooking } from "../../features/tour/TourSlice";
import { bookedStatus } from "../../utils/enums/BookedStatus";
import { activeStatus } from "../../utils/enums/ActiveStatus";
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useParams } from "react-router-dom";
import { roomTypes } from "../../utils/enums/RoomTypes";
import { getAllBlogs, getBlogById } from "../../features/blog/BlogSlice";
dayjs.extend(customParseFormat);
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { faClock, faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined } from "@ant-design/icons";
import goongApi from "../../services/goongJs/goongApi";
import DOMPurify from "dompurify";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const ViewABlog = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs?.list);
  const blog = useSelector((state) => state.blogs?.selectedBlog);
  const isLoading = useSelector((state) => state.blogs?.isLoading);
  const error = useSelector((state) => state.blogs?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [weekdaysId, setWeekdaysId] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [schedules, setSchedules] = useState({
    startDay: startDate,
    endDay: endDate,
    weeks: [],
  });
  const [dates, setDates] = useState([null, null]);
  const [errorDatePicker, setErrorDatePicker] = useState("");
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [errorChangeImage, setErrorChangeImage] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [modalVisibleRooms, setModalVisibleRooms] = useState(false);
  const [selectedHotelRooms, setSelectedHotelRooms] = useState([]);
  const [hasRooms, setHasRooms] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [dataTourRoomBooking, setDataTourRoomBooking] = useState(null);
  const [loadingButtonTourRoomBooking, setLoadingButtonTourRoomBooking] =
    useState(false);
  const [isModalTourRoomBooking, setIsModalTourRoomBooking] = useState(false);
  const [totalPriceRoom, setTotalPriceRoom] = useState(null);

  const [hashTags, setHashtags] = useState("");

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getBlogById(blogId));

    dispatch(
      getAllBlogs({
        page: 1,
        limit: 20,
      })
    );

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (blog) {
      reset({
        title: blog?.title,
        hashTags: blog?.hashTags,
        description: blog?.description,
        content: blog?.content,
        activeStatus: blog?.activeStatus,
      });

      const hashTagsArray = blog?.hashTags?.split(", ");
      setHashtags(hashTagsArray);

      if (!isLoading) {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      }
    }
  }, [blog]);

  // Event Handlers
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("thumbnail", selectedImage);

    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const thumbnail = response?.data?.data?.thumbnail;

      return thumbnail;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const onSubmit = async (data) => {
    setLoadingButton(true);

    let thumbnailToUse = selectedImage ? await uploadImage() : blog?.thumbnail;

    const newData = {
      blogId: blogId,
      title: data.title,
      content: data.content,
      activeStatus: data.activeStatus,
      thumbnail: thumbnailToUse,
    };

    console.log("newData: ", newData);

    try {
      console.log("newData: ", newData);

      const token = Cookies.get("token");

      await axios.put(`http://localhost:5050/api/v1/blogs/${blogId}`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(getBlogById(blogId));
      setIsChangeImage(false);
      resetFileInput();

      notification.success({
        message: "Blog updated successfully",
        description: "Blog updated successfully.",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleShowChangeImage = () => {
    setIsChangeImage(!isChangeImage);
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImage(null);
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  };

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }

  const sanitizedHTML = DOMPurify.sanitize(blog?.content);

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

      {/* Show content */}
      {showContent && (
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
              borderBottom: "1px solid var(--border)",
              padding: "0 0 20px 0",
              marginBottom: "10px",
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
                      View A Blog
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
              <Link to="/admin/blogs/view">
                <CustomText
                  size={"14px"}
                  weight={"500"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Back
                </CustomText>
              </Link>
            </Button>
          </Col>
          <Col xl={24}>
            <Row
              style={{
                width: "100%",
                height: "auto",
                background: "var(--bg-gray-light)",
                padding: "0",
              }}
              justify={"center"}
            >
              <Row
                gutter={20}
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "40px 0",
                }}
              >
                {/* Col content */}
                <Col span={14}>
                  {/* Title */}
                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"space-between"}
                  >
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignItems: "start",
                        gap: "15px",
                        padding: "10px 0",
                      }}
                    >
                      <CustomText
                        size={"24px"}
                        weight={"700"}
                        color={"var(--gray-text)"}
                      >
                        {blog?.title}
                      </CustomText>
                    </Col>
                  </Row>

                  {/* Hash tags */}
                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"space-between"}
                  >
                    <Col
                      span={24}
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      <CustomText
                        size={"12px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        Hash tags:
                      </CustomText>{" "}
                      {blog?.hashTags?.split(", ")?.map((tag, index) => (
                        <Tag key={index} color="var(--pink)">
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--white)"}
                          >
                            {tag}
                          </CustomText>
                        </Tag>
                      ))}
                    </Col>
                  </Row>

                  {/* Description */}
                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"space-between"}
                  >
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignItems: "start",
                        gap: "15px",
                        padding: "10px 0",
                      }}
                    >
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                        isItalic={true}
                      >
                        {blog?.description}
                      </CustomText>
                    </Col>
                  </Row>

                  {/* Created At */}
                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"space-between"}
                  >
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 0",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{
                          color: "var(--gray-light)",
                        }}
                      />
                      <CustomText
                        size={"14px"}
                        weight={"600"}
                        color={"var(--green-dark)"}
                      >
                        {formatDateTime(blog?.createdAt)}
                      </CustomText>
                    </Col>
                  </Row>

                  {/* Content */}
                  <Row
                    style={{
                      width: "100%",
                      padding: "20px 0",
                    }}
                    justify={"space-between"}
                  >
                    <Col
                      span={24}
                      style={{
                        padding: "10px 0",
                      }}
                    >
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{
                          __html: sanitizedHTML,
                        }}
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Col other blog */}
                <Col
                  span={10}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <Row
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col
                      span={24}
                      style={{
                        background: "var(--gray-mid)",
                        padding: "10px 20px",
                        textAlign: "center",
                        borderTopLeftRadius: "3px",
                        borderTopRightRadius: "3px",
                        marginBottom: "20px",
                      }}
                    >
                      <CustomText
                        size={"22px"}
                        weight={"600"}
                        color={"var(--white)"}
                      >
                        Other Blog
                      </CustomText>
                    </Col>

                    <Col span={24}>
                      {blogs && blogs.length > 0 ? (
                        blogs?.map((blog) => (
                          <Col
                            key={blog?.id}
                            span={24}
                            style={{
                              height: "auto",
                              marginBottom: "10px",
                            }}
                          >
                            <Row
                              style={{
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              {/* Thumbnail */}
                              <Col
                                span={10}
                                style={{
                                  position: "relative",
                                  overflow: "hidden",
                                  height: "auto",
                                }}
                              >
                                <Link
                                  to={`/blogs/${blog?.id}`}
                                  style={{
                                    height: "100%",
                                  }}
                                >
                                  <Image
                                    src={blog.thumbnail}
                                    preview={false}
                                    width={"100%"}
                                    style={{
                                      height: "160px",
                                      objectFit: "cover",
                                      transition: "transform 0.3s ease-in-out",
                                    }}
                                    className="image-hover-zoom"
                                  />
                                </Link>
                              </Col>

                              {/* Content */}
                              <Col
                                span={14}
                                style={{
                                  height: "160px",
                                  padding: "15px",
                                  background: "var(--white)",
                                  border: "1px solid var(--border)",
                                }}
                              >
                                {/* Title */}
                                <Col
                                  span={24}
                                  style={{
                                    marginBottom: "10px",
                                  }}
                                  className="truncated-title"
                                >
                                  <CustomText
                                    size={"16px"}
                                    weight={"500"}
                                    color={"var(--gray-text)"}
                                    link={`/blogs/${blog?.id}`}
                                  >
                                    {blog?.title}
                                  </CustomText>
                                </Col>

                                {/* Description */}
                                <Col
                                  span={24}
                                  style={{
                                    marginBottom: "10px",
                                  }}
                                  className="truncated-content"
                                >
                                  <CustomText
                                    size={"12px"}
                                    weight={"400"}
                                    color={"var(--gray-text)"}
                                  >
                                    {blog?.description}
                                  </CustomText>
                                </Col>

                                {/* Created At */}
                                <Col
                                  span={24}
                                  style={{
                                    display: "flex",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    style={{
                                      color: "var(--gray-light)",
                                    }}
                                  />
                                  <CustomText
                                    size={"13px"}
                                    weight={"600"}
                                    color={"var(--pink)"}
                                  >
                                    {formatDateTime(blog?.createdAt)}
                                  </CustomText>
                                </Col>
                              </Col>
                            </Row>
                          </Col>
                        ))
                      ) : (
                        <Col
                          span={24}
                          style={{
                            padding: "10px 0",
                            textAlign: "center",
                          }}
                        >
                          <CustomText
                            size={"14px"}
                            weight={"400"}
                            color={"var(--gray-text)"}
                          >
                            No blog found
                          </CustomText>
                        </Col>
                      )}

                      {blogs && blogs.length > 0 && (
                        <Col
                          span={24}
                          style={{
                            padding: "10px 0",
                            textAlign: "center",
                          }}
                        >
                          <Button
                            size="large"
                            style={{
                              background: "var(--white)",
                              border: "2px solid var(--green-dark)",
                              borderRadius: "3px",
                              cursor: "pointer",
                            }}
                          >
                            <CustomText
                              size={"14px"}
                              weight={"600"}
                              color={"var(--green-dark)"}
                              isButton={true}
                              link={`/admin/blogs/view`}
                            >
                              View all Blogs
                            </CustomText>
                          </Button>
                        </Col>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ViewABlog;
