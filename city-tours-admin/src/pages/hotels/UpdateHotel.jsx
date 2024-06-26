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
import { Link, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { roomTypes } from "../../utils/enums/RoomTypes";
import {
  EditOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faEye,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { activeStatus } from "../../utils/enums/ActiveStatus";
import { bookedStatus } from "../../utils/enums/BookedStatus";
import axios from "axios";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const { Meta } = Card;
const { Text } = Typography;
const { Option } = Select;

const UpdateHotel = () => {
  // Redux State
  const { hotelId } = useParams();
  const dispatch = useDispatch();
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
      });
    }
  }, [hotel]);

  useEffect(() => {
    if (selectedRoom) {
      reset({
        roomNumberRoom: selectedRoom?.roomNumber,
        typeRoom: selectedRoom?.type,
        priceRoom: selectedRoom?.price,
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

  const handleShowDetailRoom = (roomId) => {
    setIsModalDetailRoom(true);

    dispatch(getRoomById(roomId));
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
  const showModalUpdateRoom = (roomId) => {
    dispatch(getRoomById(roomId));

    setIsModalUpdateRoom(true);
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
        price: data.price,
        type: data.type,
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
                      Update Hotel - {hotel?.name}
                    </CustomText>
                  ),
                },
              ]}
            />
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
                        Rooms List
                      </CustomText>
                    ),
                  },
                ]}
              />
            </Col>
            <Row gutter={16}>
              {hotel?.rooms?.map((room) => (
                <Col
                  span={4}
                  style={{
                    height: "225px",
                    marginBottom: "16px",
                  }}
                >
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      height: "100%",
                    }}
                    actions={[
                      <Button
                        size="small"
                        style={{
                          color: "var(--gray-light)",
                          border: "none",
                        }}
                        onClick={() => handleShowDetailRoom(room?.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>,
                      <Button
                        size="small"
                        style={{
                          color: "var(--gray-light)",
                          border: "none",
                        }}
                        onClick={() => showModalUpdateRoom(room?.id)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </Button>,
                      <Popconfirm
                        title="Delete room"
                        description="Are you sure you want to delete this room?"
                        icon={
                          <QuestionCircleOutlined
                            style={{
                              color: "red",
                            }}
                          />
                        }
                        onConfirm={() => confirm(room?.id)}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          size="small"
                          style={{
                            color: "var(--gray-light)",
                            border: "none",
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Col
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                        }}
                      >
                        Room no
                      </Text>
                    </Col>

                    <Col
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "30px",
                          fontWeight: 600,
                          color: "var(--green-dark)",
                        }}
                      >
                        {room?.roomNumber}
                      </Text>
                    </Col>
                    <Col
                      style={{
                        textAlign: "center",
                        marginBottom: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 600,
                          color: "var(--green-dark)",
                        }}
                      >
                        {room?.type}
                      </Text>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Tag color="var(--pink)">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(room?.price)}{" "}
                        /per night
                      </Tag>
                    </Col>

                    {/* <Row
                      justify={"space-between"}
                      style={{
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      <Col>
                        <Tag
                          color={
                            getTagProps(room?.bookedStatus)?.color || "default"
                          }
                        >
                          {getTagProps(room?.bookedStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Col>
                      <Col>
                        <Tag
                          color={
                            getTagProps(room?.activeStatus)?.color || "default"
                          }
                        >
                          {getTagProps(room?.activeStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Col>
                    </Row> */}
                  </Card>
                </Col>
              ))}

              <Col
                span={4}
                style={{
                  height: "225px",
                }}
              >
                <Link onClick={showModalAddRoom}>
                  <Card
                    hoverable
                    bordered={false}
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Col
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "30px",
                          fontWeight: 600,
                          color: "var(--green-dark)",
                        }}
                      >
                        <FontAwesomeIcon icon={faDoorOpen} />
                      </Text>
                    </Col>
                    <Col
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "var(--green-dark)",
                        }}
                      >
                        Add Room
                      </Text>
                    </Col>
                  </Card>
                </Link>
              </Col>
            </Row>

            {/* Modal hiển thị form duyệt đơn đăng ký giáo viên */}
            <Modal
              title="Add room in hotel"
              footer={null}
              open={isModalAddRoom}
              onOk={handleOkAddRoom}
              onCancel={handleCancelAddRoom}
              width={400}
            >
              <Col xs={22} sm={20} md={16} lg={24} xl={24}>
                <Form
                  onFinish={handleSubmit(onSubmitAddRoom)}
                  layout="vertical"
                >
                  <Controller
                    name="roomNumber"
                    control={control}
                    rules={{ required: "Room number is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Room Number"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} placeholder="Enter room number" />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="price"
                    control={control}
                    rules={{
                      required: "Price is required",
                      validate: {
                        min: (value) =>
                          value >= 100000 || "Minimum price is 100,000 VND",
                        max: (value) =>
                          value <= 100000000 ||
                          "Maximum price is 100,000,000 VND",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Price / per night"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <InputNumber
                          {...field}
                          formatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(value)
                          }
                          parser={(value) => value.replace(/[^\d]/g, "")}
                          style={{
                            width: "100%",
                          }}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Room type is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Type"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          placeholder="Choose room type"
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        >
                          {roomTypes.map((type) => {
                            return (
                              <Option key={type} value={type}>
                                {type}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Form.Item
                    label="Images"
                    // validateStatus={thumbnailUrls.length === 0 ? "error" : ""}
                    // help={
                    //   thumbnailUrls.length === 0
                    //     ? "Please select at least one image"
                    //     : ""
                    // }
                  >
                    <input
                      id="imageInput"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                  </Form.Item>

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
                </Form>
              </Col>
            </Modal>

            {/* Modal hiển thị chi tiết room */}
            <Modal
              title="Detail room in hotel"
              footer={null}
              open={isModalDetailRoom}
              onOk={handleOkDetailRoom}
              onCancel={handleCancelDetailRoom}
              width={700}
            >
              <Col xs={22} sm={20} md={16} lg={24} xl={24}>
                <Form layout="vertical">
                  <Row
                    gutter={16}
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col span={12}>
                      <Form.Item label="Room Number">
                        <Input value={selectedRoom?.roomNumber} readOnly />
                      </Form.Item>

                      <Form.Item label="Price / per night">
                        <InputNumber
                          value={selectedRoom?.price}
                          formatter={(value) =>
                            new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(value)
                          }
                          parser={(value) => value.replace(/[^\d]/g, "")}
                          style={{
                            width: "100%",
                          }}
                          readOnly
                        />
                      </Form.Item>

                      <Form.Item label="Type">
                        <Input value={selectedRoom?.type} readOnly />
                      </Form.Item>

                      <Form.Item label="Booked Status">
                        <Tag
                          color={
                            getTagProps(selectedRoom?.bookedStatus)?.color ||
                            "default"
                          }
                        >
                          {getTagProps(selectedRoom?.bookedStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Form.Item>

                      <Form.Item label="Active Status">
                        <Tag
                          color={
                            getTagProps(selectedRoom?.activeStatus)?.color ||
                            "default"
                          }
                        >
                          {getTagProps(selectedRoom?.activeStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Images">
                        <Row
                          gutter={8}
                          style={{
                            width: "100%",
                          }}
                        >
                          {selectedRoom?.imageUrls.map((url, index) => (
                            <Col
                              span={12}
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
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Modal>

            {/* Modal hiển thị form duyệt đơn đăng ký giáo viên */}
            <Modal
              title="Update room in hotel"
              footer={null}
              open={isModalUpdateRoom}
              onOk={handleOkUpdateRoom}
              onCancel={handleCancelUpdateRoom}
              width={700}
            >
              <Form
                onFinish={handleSubmit(onSubmitUpdateRoom)}
                layout="vertical"
              >
                <Row
                  gutter={16}
                  style={{
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <Controller
                      name="roomNumberRoom"
                      control={control}
                      rules={{ required: "Room number is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="Room Number"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                        >
                          <Input {...field} placeholder="Enter room number" />
                        </Form.Item>
                      )}
                    />

                    <Controller
                      name="priceRoom"
                      control={control}
                      rules={{
                        required: "Price is required",
                        validate: {
                          min: (value) =>
                            value >= 100000 || "Minimum price is 100,000 VND",
                          max: (value) =>
                            value <= 100000000 ||
                            "Maximum price is 100,000,000 VND",
                        },
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="Price / per night"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                        >
                          <InputNumber
                            {...field}
                            formatter={(value) =>
                              new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(value)
                            }
                            parser={(value) => value.replace(/[^\d]/g, "")}
                            style={{
                              width: "100%",
                            }}
                          />
                        </Form.Item>
                      )}
                    />

                    <Controller
                      name="typeRoom"
                      control={control}
                      rules={{ required: "Room type is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="Type"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                        >
                          <Select
                            {...field}
                            placeholder="Choose room type"
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {roomTypes.map((type) => {
                              return (
                                <Option key={type} value={type}>
                                  {type}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    />

                    <Controller
                      name="bookedStatusRoom"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="Booked Status"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                        >
                          <Select
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            {bookedStatus.map((bookedStatusRoom) => {
                              let label = bookedStatusRoom;

                              if (bookedStatusRoom === "NOT_BOOKED") {
                                label = "Not Booked";
                              } else if (bookedStatusRoom === "BOOKED") {
                                label = "Booked";
                              } else if (bookedStatusRoom === "CANCELLED") {
                                label = "Cancelled";
                              }

                              return (
                                <Option
                                  key={bookedStatusRoom}
                                  value={bookedStatusRoom}
                                >
                                  {label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    />

                    <Controller
                      name="activeStatusRoom"
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
                            {activeStatus.map((activeStatusRoom) => {
                              let label = activeStatusRoom;

                              if (activeStatusRoom === "ACTIVE") {
                                label = "Active";
                              } else if (activeStatusRoom === "IN_ACTIVE") {
                                label = "In Active";
                              }

                              return (
                                <Option
                                  key={activeStatusRoom}
                                  value={activeStatusRoom}
                                >
                                  {label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Images">
                      <Row
                        gutter={8}
                        style={{
                          width: "100%",
                        }}
                      >
                        {selectedRoom?.imageUrls.map((url, index) => (
                          <Col
                            span={12}
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

                      <Button
                        style={{
                          background: "var(--green-dark)",
                          color: "var(--white)",
                          border: "var(--green-dark)",
                        }}
                        onClick={handleShowChangeImageUpdateRoom}
                      >
                        Change image
                      </Button>
                    </Form.Item>

                    {isChangeImageUpdateRoom && (
                      <Controller
                        name="logo"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <input
                            id="imageInputUpdateRoom"
                            type="file"
                            multiple
                            onChange={handleImageChangeUpdateRoom}
                          />
                        )}
                      />
                    )}

                    {/* <Form.Item
                      label="Images"
                      // validateStatus={thumbnailUrls.length === 0 ? "error" : ""}
                      // help={
                      //   thumbnailUrls.length === 0
                      //     ? "Please select at least one image"
                      //     : ""
                      // }
                    >
                      <input
                        id="imageInputUpdateRoom"
                        type="file"
                        multiple
                        onChange={handleImageChangeUpdateRoom}
                      />
                    </Form.Item> */}

                    <Form.Item>
                      <Button
                        htmlType="submit"
                        style={{
                          background: "var(--pink)",
                          color: "var(--white)",
                          marginTop: "20px",
                          width: "100%",
                        }}
                        icon={loadingButtonUpdateRoom ? <Spin /> : null}
                        loading={loadingButtonUpdateRoom}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Modal>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UpdateHotel;
