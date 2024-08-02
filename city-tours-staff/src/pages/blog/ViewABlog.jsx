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
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useParams } from "react-router-dom";
import { roomTypes } from "../../utils/enums/RoomTypes";
import { getBlogById } from "../../features/blog/BlogSlice";
dayjs.extend(customParseFormat);
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ViewABlog = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const { blogId } = useParams();
  const dispatch = useDispatch();
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
                      Update Tour
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
              <Link to="/staff/blogs/view">
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
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <Row
                style={{
                  width: "100%",
                }}
                justify={"center"}
              >
                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Title is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Title"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} placeholder="Enter title" readOnly />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="hashTags"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Hashtags"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select value={hashTags} mode="tags"></Select>
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Description"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input.TextArea
                          {...field}
                          placeholder="Enter description"
                          readOnly
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="content"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Content"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                        style={{
                          height: "520px",
                        }}
                      >
                        <ReactQuill
                          {...field}
                          theme="snow"
                          modules={modules}
                          style={{
                            height: "400px",
                          }}
                          readOnly
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="activeStatus"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Active Status"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} placeholder="Enter title" readOnly />
                      </Form.Item>
                    )}
                  />

                  <Form.Item
                    label="Thumbnail"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Image
                      src={blog?.thumbnail}
                      width={"100%"}
                      height={"300px"}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ViewABlog;
