import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Table,
  TimePicker,
  Typography,
  Image,
  Button,
  Tag,
  Card,
  Modal,
  Select,
  InputNumber,
  notification,
  Spin,
  Popconfirm,
  Slider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoom,
  deleteRoom,
  getHotelById,
  getRoomById,
  updateHotel,
  updateRoom,
} from "../../features/hotel/HotelSlice";
import "../../App.css";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  EditOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faDoorOpen,
  faEye,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { activeStatus } from "../../utils/enums/ActiveStatus";
import { bookedStatus } from "../../utils/enums/BookedStatus";
import axios from "axios";
dayjs.extend(customParseFormat);
import { roomTypes } from "../../utils/enums/RoomTypes";
import { roomCategories } from "../../utils/enums/RoomCategories";

const { RangePicker } = DatePicker;

const { Meta } = Card;
const { Text } = Typography;
const { Option } = Select;

const UpdateHotel = () => {
  // Redux State
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hotel = useSelector((state) => state.hotels?.selectedHotel);
  const selectedRoom = useSelector((state) => state.hotels?.selectedRoom);
  const isLoading = useSelector((state) => state.hotels?.isLoading);
  const error = useSelector((state) => state.hotels?.error);

  // Local State
  const [showContent, setShowContent] = useState(false);
  const [isModalAddRoom, setIsModalAddRoom] = useState(false);
  const [isModalUpdateRoom, setIsModalUpdateRoom] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [loadingButtonUpdateHotel, setLoadingButtonUpdateHotel] =
    useState(false);
  const [loadingButtonUpdateRoom, setLoadingButtonUpdateRoom] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesUpdateHotel, setSelectedImagesUpdateHotel] = useState(
    []
  );
  const [selectedImagesUpdateRoom, setSelectedImagesUpdateRoom] = useState([]);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [isChangeImageUpdateRoom, setIsChangeImageUpdateRoom] = useState(false);
  const [errorChangeImage, setErrorChangeImage] = useState(false);
  const [isModalDetailRoom, setIsModalDetailRoom] = useState(false);
  const [isWeekend, setIsWeekend] = useState(null);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getHotelById(hotelId));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel?.name,
        description: hotel?.description,
        address: hotel?.address,
        activeStatus: hotel?.activeStatus,
        rating: hotel?.rating,
      });
    }
  }, [hotel]);

  useEffect(() => {
    if (selectedRoom) {
      reset({
        roomNumberRoom: selectedRoom?.roomNumber,
        typeRoom: selectedRoom?.type,
        priceRoom: selectedRoom?.price,
        discountRoom: selectedRoom?.discount,
        bookedStatusRoom: selectedRoom?.bookedStatus,
        activeStatusRoom: selectedRoom?.activeStatus,
      });
    }
  }, [selectedRoom]);

  const getTagProps = (bookedStatus) => {
    let color, tagText;

    switch (bookedStatus) {
      case "CANCELLED":
        color = "red";
        tagText = "Cancelled";
        break;
      case "NOT_BOOKED":
        color = "blue";
        tagText = "Not Booked";
        break;
      case "BOOKED":
        color = "green";
        tagText = "Booked";
        break;
      case "ACTIVE":
        color = "cyan";
        tagText = "Active";
        break;
      case "IN_ACTIVE":
        color = "volcano";
        tagText = "Inactive";
        break;
      default:
        color = "default";
        tagText = "Unknown";
        break;
    }

    return { color, tagText };
  };

  const handleNavigateDetailRoom = (roomId) => {
    navigate(`/admin/hotels/${hotelId}/room/${roomId}/view`);
  };

  // Modal detail room
  const handleOkDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  const handleCancelDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  // Modal add room
  const showModalAddRoom = () => {
    setIsModalAddRoom(true);
  };

  const handleOkAddRoom = () => {
    setIsModalAddRoom(false);
  };

  const handleCancelAddRoom = () => {
    setIsModalAddRoom(false);
  };

  // Modal update room
  const handleNavigateUpdateRoom = (roomId) => {
    navigate(`/admin/hotels/${hotelId}/room/${roomId}/update`);
  };

  const handleOkUpdateRoom = () => {
    setIsModalUpdateRoom(false);
  };

  const handleCancelUpdateRoom = () => {
    setIsModalUpdateRoom(false);
  };

  // Reset input image add room
  const resetFileInput = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImages(null);
  };

  // Reset input image update hotel
  const resetFileInputUpdateHotel = () => {
    const fileInput = document.getElementById("imageInputUpdateHotel");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImagesUpdateHotel(null);
  };

  // Reset input image update room
  const resetFileInputUpdateRoom = () => {
    const fileInput = document.getElementById("imageInputUpdateRoom");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImagesUpdateRoom(null);
  };

  // Show change image update hotel
  const handleShowChangeImage = () => {
    setIsChangeImage(!isChangeImage);
  };

  // Show change image update room
  const handleShowChangeImageUpdateRoom = () => {
    setIsChangeImageUpdateRoom(!isChangeImageUpdateRoom);
  };

  // Onchange image add room
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    console.log("selectedImages: ", selectedImages);
  };

  // Onchange image update hotel
  const handleImageChangeUpdateHotel = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImagesUpdateHotel(files);

    console.log("selectedImages: ", selectedImagesUpdateHotel);
  };

  // Onchange image update room
  const handleImageChangeUpdateRoom = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImagesUpdateRoom(files);

    console.log("selectedImages: ", selectedImagesUpdateRoom);
  };

  // Function upload images add room
  const uploadImages = async () => {
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const formData = new FormData();
        formData.append("thumbnail", image);

        const response = await axios.post(
          `http://localhost:5050/api/v1/auth/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response?.data?.data?.thumbnail;
      });

      const urls = await Promise.all(uploadPromises);

      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  // Function upload images update hotel
  const uploadImagesUpdateHotel = async () => {
    try {
      const uploadPromises = selectedImagesUpdateHotel.map(async (image) => {
        const formData = new FormData();
        formData.append("thumbnail", image);

        const response = await axios.post(
          `http://localhost:5050/api/v1/auth/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response?.data?.data?.thumbnail;
      });

      const urls = await Promise.all(uploadPromises);

      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  // Function upload images update room
  const uploadImagesUpdateRoom = async () => {
    try {
      const uploadPromises = selectedImagesUpdateRoom.map(async (image) => {
        const formData = new FormData();
        formData.append("thumbnail", image);

        const response = await axios.post(
          `http://localhost:5050/api/v1/auth/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response?.data?.data?.thumbnail;
      });

      const urls = await Promise.all(uploadPromises);

      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  // Submit add room
  const onSubmitAddRoom = async (data) => {
    console.log("data: ", data);

    try {
      setLoadingButton(true);

      const urls = await uploadImages();

      const newData = {
        hotelId: parseInt(hotelId),
        roomNumber: data.roomNumber,
        basePrice: data.basePrice,
        weekendPrice: data.weekendPrice,
        discount: data.discount || 0.0,
        type: data.type,
        numberOfResidents: data.numberOfResidents,
        roomHolidays: holidaysData,
        imageUrls: urls,
      };

      console.log("newData: ", newData);

      const action = await dispatch(createRoom(newData));

      console.log("action: ", action);

      if (createRoom.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          resetFileInput();
          setIsModalAddRoom(false);
          dispatch(getHotelById(hotelId));

          setHolidays(null);
          setHolidaysData(null);

          notification.success({
            message: "Room created successfully",
            description: "Room created successfully.",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Create Room Error",
            description: error,
          });
        }
      } else if (createAccount.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Create Account Error",
          description: error,
        });
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  // Submit update hotel
  const onSubmitUpdateHotel = async (data) => {
    try {
      setLoadingButtonUpdateHotel(true);

      let thumbnailUrlsToUse = [];

      if (selectedImagesUpdateHotel && selectedImagesUpdateHotel.length > 0) {
        thumbnailUrlsToUse = await uploadImagesUpdateHotel();
      } else {
        thumbnailUrlsToUse = hotel?.thumbnailUrls || [];
      }

      const newData = {
        hotelId: parseInt(hotelId),
        name: data.name,
        description: data.description,
        address: data.address,
        activeStatus: data.activeStatus,
        thumbnailUrls: thumbnailUrlsToUse,
        rating: data.rating,
      };

      console.log("newDataUpdateHotel: ", newData);

      const action = await dispatch(updateHotel(newData));

      console.log("action: ", action);

      if (updateHotel.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          resetFileInputUpdateHotel();
          setIsChangeImage(false);
          dispatch(getHotelById(hotelId));

          notification.success({
            message: "Room updated successfully",
            description: "Room updated successfully.",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Create Room Error",
            description: error,
          });
        }
      } else if (updateHotel.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Create Account Error",
          description: error,
        });
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButtonUpdateHotel(false);
    }
  };

  // Submit update room
  const onSubmitUpdateRoom = async (data) => {
    console.log("onSubmitUpdateRoom");
    try {
      setLoadingButtonUpdateRoom(true);

      let imageUrlsToUse = [];

      if (selectedImagesUpdateRoom && selectedImagesUpdateRoom.length > 0) {
        imageUrlsToUse = await uploadImagesUpdateRoom();
      } else {
        imageUrlsToUse = selectedRoom?.imageUrls || [];
      }

      const newData = {
        roomId: parseInt(selectedRoom?.id),
        roomNumber: data.roomNumberRoom,
        type: data.typeRoom,
        price: data.priceRoom,
        discount: data.discountRoom,
        bookedStatus: data.bookedStatusRoom,
        activeStatus: data.activeStatusRoom,
        imageUrls: imageUrlsToUse,
      };

      console.log("newDataUpdateRoom: ", newData);

      const action = await dispatch(updateRoom(newData));

      console.log("action: ", action);

      if (updateRoom.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          resetFileInputUpdateRoom();
          setIsModalUpdateRoom(false);
          setIsChangeImageUpdateRoom(false);
          // dispatch(getHotelById(hotelId));

          notification.success({
            message: "Room updated successfully",
            description: "Room updated successfully.",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Create Room Error",
            description: error,
          });
        }
      } else if (updateRoom.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Create Account Error",
          description: error,
        });
      }
    } catch (error) {
      console.error("Error creating hotel:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButtonUpdateRoom(false);
    }
  };

  // Submit delete room
  const confirm = async (roomId) => {
    try {
      await dispatch(deleteRoom(roomId));

      notification.success({
        message: "Room Deletion Confirmation",
        description: "Successfully deleted the room.",
      });

      dispatch(getHotelById(hotelId));
    } catch (error) {
      console.error("Error deleting user:", error);

      notification.error({
        message: "Room Deletion Failed",
        description: "Failed to delete the room.",
      });
    }
  };

  const cancel = (e) => {};

  useEffect(() => {
    const checkWeekendDay = () => {
      const currentDate = new Date();

      const dayOfWeek = currentDate.getDay();
      console.log("dayOfWeek: ", dayOfWeek);

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      setIsWeekend(isWeekend);
    };

    checkWeekendDay();
  }, []);

  console.log("isWeekend", isWeekend);

  const [holidays, setHolidays] = useState(null);
  const [holidaysData, setHolidaysData] = useState([]);

  const onChangeHolidays = (date, dateString) => {
    setHolidays(dateString);
    setHolidaysData([]);
  };

  const handlePriceChange = (dateString, priceString) => {
    const price = parseInt(priceString);
    const updatedHolidaysData = [...holidaysData];
    const index = updatedHolidaysData.findIndex((h) => h.date === dateString);
    if (index !== -1) {
      updatedHolidaysData[index].price = price;
    } else {
      updatedHolidaysData.push({ date: dateString, price });
    }
    setHolidaysData(updatedHolidaysData);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const day = String(today.getDate()).padStart(2, "0");

    console.log(`${year}-${month}-${day}`);

    return `${year}-${month}-${day}`;
  };

  // Room update
  const roomsColumns = [
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
          Type <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "type",
    },
    {
      title: (
        <>
          Caterory <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "category",
    },
    {
      title: (
        <>
          Number <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "roomNumber",
    },
    {
      title: (
        <>
          Views <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "roomViews",
      render: (roomViews) => (
        <>
          {roomViews.map((view) => (
            <Col
              key={view.id}
              span={24}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Tag>{view.name}</Tag>
              {view?.images?.split(",").map((image, idx) => (
                <Image
                  key={idx}
                  src={image}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Col>
          ))}
        </>
      ),
    },
    {
      title: (
        <>
          Images <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "imageUrls",
      render: (imageUrls) => (
        <>
          <Col
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {imageUrls.map((image, idx) => (
              <Image
                key={idx}
                src={image}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                }}
              />
            ))}
          </Col>
        </>
      ),
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
            onClick={() => handleNavigateViewRoom(record?.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateUpdateRoom(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </>
      ),
    },
  ];

  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // const onSearch = (value) => {
  //   console.log(value);
  // };

  const onChangeType = (value) => {
    console.log(value);
    setTypeFilter(value);
  };

  const onChangeCategory = (value) => {
    console.log(value);
    setCategoryFilter(value);
  };

  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const onChangeComplete = (value) => {
    console.log("onChangeComplete: ", value);
    // setPriceRange(value);
  };

  const filterRooms = () => {
    if (!hotel?.rooms) return [];

    return hotel?.rooms?.filter((room) => {
      const isTypeMatch =
        typeFilter.trim() !== "" ? room.type === typeFilter : true;
      const isCategoryMatch =
        categoryFilter.trim() !== "" ? room.category === categoryFilter : true;
      const { defaultPrice, weekdayPrice, weekendPrice } = room;

      const isPriceMatch =
        (defaultPrice >= priceRange[0] && defaultPrice <= priceRange[1]) ||
        (weekdayPrice >= priceRange[0] && weekdayPrice <= priceRange[1]) ||
        (weekendPrice >= priceRange[0] && weekendPrice <= priceRange[1]);

      return isTypeMatch && isCategoryMatch && isPriceMatch;
    });
  };

  console.log("typeFilter: ", typeFilter);
  console.log("categoryFilter: ", categoryFilter);
  console.log("priceRange: ", priceRange);
  console.log("filteredRooms: ", filteredRooms);

  useEffect(() => {
    if (hotel?.rooms) {
      setFilteredRooms(filterRooms());
    }
  }, [hotel?.rooms, typeFilter, categoryFilter, priceRange]);

  const marks = {
    0: "0đ",
    2500000: "2.500.000đ",
    5000000: "5.000.000đ",
    7500000: "7.500.000đ",
    10000000: "10.000.000đ",
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
                      Update Hotel - {hotel?.name}{" "}
                      {/* <Button onClick={displayedPrice}>Test</Button> */}
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
              <Link to="/admin/hotels/view">
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
            <Form
              onFinish={handleSubmit(onSubmitUpdateHotel)}
              layout="vertical"
            >
              <Row
                style={{
                  width: "100%",
                }}
                justify={"space-between"}
              >
                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="Region">
                    <Input value={hotel?.regionName} readOnly />
                  </Form.Item>

                  <Form.Item label="Province">
                    <Input value={hotel?.provinceName} readOnly />
                  </Form.Item>

                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Name"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} />
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
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: "Address is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Address"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: "Rating is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Rating"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <InputNumber
                          {...field}
                          style={{
                            width: "100%",
                          }}
                          min={3}
                          max={5}
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
                        <Select
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {activeStatus.map((activeStatus) => {
                            let label = activeStatus;

                            if (activeStatus === "ACTIVE") {
                              label = "Active";
                            } else if (activeStatus === "IN_ACTIVE") {
                              label = "In Active";
                            }

                            return (
                              <Option key={activeStatus} value={activeStatus}>
                                {label}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  />
                </Col>

                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="Images">
                    <Row
                      style={{
                        width: "100%",
                      }}
                    >
                      {hotel.thumbnailUrls.map((url, index) => (
                        <Col
                          xxl={6}
                          xl={6}
                          lg={6}
                          key={index}
                          style={{ marginBottom: "10px" }}
                        >
                          <Image
                            src={url}
                            width={"100%"}
                            height={"150px"}
                            style={{
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              objectFit: "cover",
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                    {errorChangeImage && (
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--red)"}
                        isButton={true}
                      >
                        Please choose a new image logo
                      </CustomText>
                    )}
                    <br />
                    <Button
                      style={{
                        background: "var(--green-dark)",
                        color: "var(--white)",
                        border: "var(--green-dark)",
                      }}
                      onClick={handleShowChangeImage}
                    >
                      Change image
                    </Button>
                  </Form.Item>
                  {isChangeImage && (
                    <Controller
                      name="logo"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <input
                          id="imageInputUpdateHotel"
                          type="file"
                          multiple
                          onChange={handleImageChangeUpdateHotel}
                        />
                      )}
                    />
                  )}
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{
                        background: "var(--pink)",
                        color: "var(--white)",
                        marginTop: "20px",
                        width: "100%",
                      }}
                      icon={loadingButtonUpdateHotel ? <Spin /> : null}
                      loading={loadingButtonUpdateHotel}
                    >
                      Save
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col xxl={24} xl={24} lg={24}>
            <Col
              xl={24}
              style={{
                borderTop: "1px solid var(--border)",
                padding: "20px 0 20px 0",
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
                        Rooms List
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
                <Link to={`/admin/hotels/${hotelId}/room/create`}>
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Create Room
                  </CustomText>
                </Link>
              </Button>
            </Col>
            <Col
              span={24}
              style={{
                padding: "0 40px 20px 0",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "30px",
              }}
            >
              {/* <Search
                  placeholder="Search type and category"
                  onSearch={onSearch}
                  style={{
                    width: 300,
                  }}
                /> */}

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Text>Types</Text>
                <Select
                  onChange={onChangeType}
                  style={{
                    width: "150px",
                  }}
                  defaultValue={""}
                >
                  <Option value={""}>All</Option>
                  {roomTypes?.map((type, index) => {
                    return (
                      <Option key={index} value={type}>
                        {type}
                      </Option>
                    );
                  })}
                </Select>
              </Col>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Text>Categories</Text>
                <Select
                  onChange={onChangeCategory}
                  style={{
                    width: "150px",
                  }}
                  defaultValue={""}
                >
                  <Option value={""}>All</Option>
                  {roomCategories?.map((cate, index) => {
                    return (
                      <Option key={index} value={cate}>
                        {cate}
                      </Option>
                    );
                  })}
                </Select>
              </Col>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text>Price</Text>
                <Slider
                  range
                  min={0}
                  max={10000000}
                  step={100}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  onChangeComplete={onChangeComplete}
                  marks={marks}
                  style={{
                    width: "400px",
                  }}
                />
              </Col>
            </Col>
            <Row gutter={16}>
              <Col span={24}>
                <Table
                  columns={roomsColumns}
                  dataSource={filteredRooms}
                  rowKey="id"
                  pagination={false}
                  // pagination={{
                  //   pageSize: pagination.limit,
                  //   total:
                  //     Math.ceil(totalPages / pagination.limit) * pagination.limit,
                  //   current: currentPage,
                  // }}
                  // onChange={handleTableChange}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UpdateHotel;
