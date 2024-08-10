import { useEffect, useState } from "react";
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
  TimePicker,
  Typography,
  InputNumber,
  Timeline,
  Tag,
  Modal,
  Card,
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
import { generateTourCode } from "../../utils/generateTourCode";
dayjs.extend(customParseFormat);
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { vietnamProvinces } from "../../utils/data/VietnamProvinces";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CreateBlog = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.info?.id);
  const hotels = useSelector((state) => state.hotels?.list);
  const isLoading = useSelector((state) => state.hotels?.isLoading);
  const error = useSelector((state) => state.hotels?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [schedules, setSchedules] = useState({
    startDay: startDate,
    endDay: endDate,
    weeks: [],
  });
  const [dates, setDates] = useState([null, null]);
  const [errorDatePicker, setErrorDatePicker] = useState("");
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [modalVisibleRooms, setModalVisibleRooms] = useState(false);
  const [selectedHotelRooms, setSelectedHotelRooms] = useState([]);
  const [hasRooms, setHasRooms] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [hashTags, setHashtags] = useState("");

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

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

    try {
      const thumbnail = await uploadImage();

      const hashTagsString = hashTags?.join(", ");

      const newData = {
        userId: userId,
        title: data.title,
        hashTags: hashTagsString,
        description: data.description,
        content: data.content,
        thumbnail: thumbnail,
        activeStatus: "ACTIVE",
      };

      console.log("newData: ", newData);

      const token = Cookies.get("token");

      await axios.post(`http://localhost:5050/api/v1/blogs/create`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      reset();
      resetFileInput();

      notification.success({
        message: "Blog created successfully",
        description: "Blog created successfully.",
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
                      Create Blog
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
                        <Input {...field} placeholder="Enter title" />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="hastag"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Hashtags"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          mode="multiple"
                          onChange={(value) => {
                            field.onChange(value);
                            setHashtags(value);
                          }}
                          placeholder="Choose hashtags"
                        >
                          {vietnamProvinces.map((province) => (
                            <Select.Option
                              key={province.value}
                              value={province.value}
                            >
                              {province.value}
                            </Select.Option>
                          ))}
                        </Select>
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
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="thumbnail"
                    control={control}
                    rules={{
                      required: "Please select an image.",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Thumbnail"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <input
                          id="imageInput"
                          type="file"
                          onChange={(e) => {
                            setSelectedImage(e.target.files[0]);
                            field.onChange(e.target.files[0]);
                            setErrorChangeImage(false);
                          }}
                        />
                      </Form.Item>
                    )}
                  />

                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{
                        background: "var(--pink)",
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
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CreateBlog;
