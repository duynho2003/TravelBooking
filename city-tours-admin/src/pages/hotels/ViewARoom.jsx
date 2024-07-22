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
  Space,
  List,
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
import { roomTypes } from "../../utils/enums/RoomTypes";
import {
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faEye,
  faPen,
  faPlus,
  faTrashCan,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { activeStatus } from "../../utils/enums/ActiveStatus";
import { bookedStatus } from "../../utils/enums/BookedStatus";
import axios from "axios";
dayjs.extend(customParseFormat);
import { roomCategories } from "../../utils/enums/RoomCategories";

const { RangePicker } = DatePicker;

const { Meta } = Card;
const { Text } = Typography;
const { Option } = Select;

const ViewARoom = () => {
  // Redux State
  const { hotelId, roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [defaultValuesDatePicker, setDefaultValuesDatePicker] = useState(null);

  // React Hook Form
  const { control, handleSubmit, reset, watch, setValue } = useForm();
  const roomType = watch("roomType");

  // useEffect for loading data
  useEffect(() => {
    dispatch(getRoomById(roomId));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedRoom) {
      reset({
        roomNumber: selectedRoom?.roomNumber,
        roomCategory: selectedRoom?.category,
        defaultPrice: selectedRoom.defaultPrice,
        weekdayPrice: selectedRoom.weekdayPrice,
        weekendPrice: selectedRoom.weekendPrice,
        discount: selectedRoom?.discount,
        roomType: selectedRoom?.type,
        category: selectedRoom?.roomCategory,
        quantityAdult: selectedRoom?.quantityAdult,
        quantityChild: selectedRoom?.quantityChild,
        childCharge: selectedRoom?.childCharge,
        quantityBaby: selectedRoom?.quantityBaby,
        babyCharge: selectedRoom?.babyCharge,
        activeStatus: selectedRoom?.activeStatus,
      });

      setViews(selectedRoom?.roomViews);

      setIsFreeChild(!selectedRoom.childCharge);
      setIsFreeBaby(!selectedRoom?.babyCharge);

      const initHolidays = selectedRoom?.roomHolidays?.map((holiday) => {
        return holiday?.date;
      });
      const initHolidaysData = selectedRoom?.roomHolidays?.map((holiday) => ({
        id: holiday?.id,
        date: holiday?.date,
        price: holiday?.price,
      }));
      const initValuesDatePicker = initHolidays?.map((holiday) => {
        return dayjs(holiday);
      });
      initValuesDatePicker?.sort((a, b) => a - b);

      setHolidays(initHolidays);
      setHolidaysData(initHolidaysData);
      setDefaultValuesDatePicker(initValuesDatePicker);

      console.log("initHolidays: ", initHolidays);
      console.log("initHolidaysData: ", initHolidaysData);
      console.log("defaultValuesDatePicker: ", defaultValuesDatePicker);
    }
  }, [selectedRoom]);

  // Reset input image add room
  const resetFileInput = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImages(null);
  };

  // Reset input image update room
  const resetFileInputUpdateRoom = () => {
    const fileInput = document.getElementById("imageInputUpdateRoom");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImagesUpdateRoom(null);
  };

  // Show change image update room
  const handleShowChangeImageUpdateRoom = () => {
    setIsChangeImageUpdateRoom(!isChangeImageUpdateRoom);
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
    // console.log("data: ", data);

    try {
      setLoadingButton(true);

      let imageUrlsToUse = [];

      if (selectedImagesUpdateRoom && selectedImagesUpdateRoom.length > 0) {
        imageUrlsToUse = await uploadImagesUpdateRoom();
      } else {
        imageUrlsToUse = selectedRoom?.imageUrls || [];
      }

      const newData = {
        roomId: parseInt(roomId),
        roomNumber: data.roomNumber,
        basePrice: data.basePrice,
        weekendPrice: data.weekendPrice,
        discount: data.discount || 0.0,
        type: data.type,
        numberOfResidents: data.numberOfResidents,
        activeStatus: data.activeStatus,
        roomHolidays: holidaysData,
        imageUrls: imageUrlsToUse,
      };

      console.log("newData: ", newData);

      const action = await dispatch(updateRoom(newData));

      console.log("action: ", action);

      if (updateRoom.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          resetFileInputUpdateRoom();
          setIsChangeImageUpdateRoom(false);

          dispatch(getRoomById(parseInt(roomId)));

          notification.success({
            message: "Room updated successfully",
            description: "Room updated successfully.",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Update Room Error",
            description: error,
          });
        }
      } else if (updateRoom.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Update Room Error",
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

  const onChangeHolidays = (dates, dateStrings) => {
    // Remove holidays not selected
    const updatedHolidaysData = holidaysData.filter((holiday) =>
      dateStrings.includes(holiday.date)
    );

    // Add new holidays
    dateStrings.forEach((dateString) => {
      if (!updatedHolidaysData.find((holiday) => holiday.date === dateString)) {
        updatedHolidaysData.push({ date: dateString });
      }
    });

    setHolidays(dateStrings);
    setHolidaysData(updatedHolidaysData);
  };

  const handlePriceChange = (dateString, priceString) => {
    const price = parseInt(priceString);
    const updatedHolidaysData = holidaysData.map((holiday) =>
      holiday.date === dateString ? { ...holiday, price } : holiday
    );
    setHolidaysData(updatedHolidaysData);
  };

  // Views
  const [isOpenViews, setIsOpenViews] = useState(true);
  const [views, setViews] = useState([]);
  const [view, setView] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [selectedImagesViews, setSelectedImagesViews] = useState([]);
  const [isLoadingAddView, setIsLoadingAddView] = useState(false);

  const handleOpenViews = () => {
    setIsOpenViews(!isOpenViews);
  };

  const handleChangeView = (value) => {
    setView(value);
  };

  const handleImageChangeViews = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImagesViews(files);
  };

  const uploadImagesViews = async () => {
    try {
      const uploadPromises = selectedImagesViews.map(async (image) => {
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

  const handleAddView = async () => {
    setIsLoadingAddView(true);

    try {
      const uploadedImageUrls = await uploadImagesViews();

      setViews((prev) => [...prev, { view, viewImages: uploadedImageUrls }]);

      setView(null);
      setViewImage(null);
      setSelectedImages([]);
      setIsOpenViews(false);
    } catch (error) {
      console.error("Error adding view:", error);
    } finally {
      setIsLoadingAddView(false);
    }
  };

  const handleDeleteView = (indexToRemove) => {
    setViews((prevViews) =>
      prevViews.filter((_, index) => index !== indexToRemove)
    );
  };

  console.log("views: ", views);

  const [percentageWeekdayPrice, setPercentageWeekdayPrice] = useState(0);
  const [percentageWeekendPrice, setPercentageWeekendPrice] = useState(0);

  const defaultPriceValue = watch("defaultPrice");

  // Update weekday price based on default price and percentage
  useEffect(() => {
    if (defaultPriceValue) {
      const calculatedPrice =
        defaultPriceValue * (1 + percentageWeekdayPrice / 100);
      setValue("weekdayPrice", calculatedPrice);
    }
  }, [defaultPriceValue, percentageWeekdayPrice, setValue]);

  const handlePercentageChangeWeekdayPrice = (value) => {
    setPercentageWeekdayPrice(value);
  };

  useEffect(() => {
    if (defaultPriceValue) {
      const calculatedPrice =
        defaultPriceValue * (1 + percentageWeekendPrice / 100);
      setValue("weekendPrice", calculatedPrice);
    }
  }, [defaultPriceValue, percentageWeekendPrice, setValue]);

  const handlePercentageChangeWeekendPrice = (value) => {
    setPercentageWeekendPrice(value);
  };

  const [isFreeChild, setIsFreeChild] = useState(true);

  const handleFreeClickChild = () => {
    setIsFreeChild(true);
    setValue("childCharge", 0);
  };

  const handleChargeClickChild = () => {
    setIsFreeChild(false);
  };

  const [isFreeBaby, setIsFreeBaby] = useState(true);

  const handleFreeClickBaby = () => {
    setIsFreeBaby(true);
    setValue("babyCharge", 0);
  };

  const handleChargeClickBaby = () => {
    setIsFreeBaby(false);
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
                      View A Room
                    </CustomText>
                  ),
                },
              ]}
            />
          </Col>
          <Col xl={24}>
            <Form
              onFinish={handleSubmit(onSubmitAddRoom)}
              layout="vertical"
              style={{
                width: "100%",
              }}
            >
              <Row
                justify={"space-between"}
                style={{
                  width: "100%",
                }}
                gutter={20}
              >
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form.Item label="Type">
                    <Input value={selectedRoom?.type} readOnly />
                  </Form.Item>

                  <Form.Item label="Categories">
                    <Button
                      type={"primary"}
                      style={{
                        margin: "0 8px 8px 0",
                        backgroundColor: "var(--green-dark)",
                        color: "#fff",
                      }}
                      disabled
                    >
                      {selectedRoom?.category}
                    </Button>
                  </Form.Item>

                  <Form.Item label="Number">
                    <Input value={selectedRoom?.roomNumber} readOnly />
                  </Form.Item>

                  <Form.Item label={<>Views </>}>
                    <List
                      header={<div>List Views</div>}
                      bordered
                      dataSource={views}
                      renderItem={(item, index) => (
                        <List.Item
                          style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Tag>{item?.name}</Tag>
                          {item?.images?.split(",")?.map((image, idx) => (
                            <Image
                              key={idx}
                              src={image}
                              alt={`View ${index + 1} Image ${idx + 1}`}
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "5px",
                              }}
                            />
                          ))}
                        </List.Item>
                      )}
                    />
                  </Form.Item>

                  <Form.Item label="Quantity Adult">
                    <Input value={selectedRoom?.quantityAdult} readOnly />
                  </Form.Item>

                  <Form.Item label="Quantity Child">
                    <Input value={selectedRoom?.quantityChild} readOnly />
                  </Form.Item>

                  <Controller
                    name="childCharge"
                    control={control}
                    defaultValue={0}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Child Charge / Person"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Space
                            direction="horizontal"
                            style={{ width: "100%" }}
                          >
                            {isFreeChild && (
                              <Button
                                size="middle"
                                type={isFreeChild ? "primary" : "default"}
                                onClick={handleFreeClickChild}
                              >
                                Free
                              </Button>
                            )}
                            {!isFreeChild && (
                              <Button
                                size="middle"
                                type={!isFreeChild ? "primary" : "default"}
                                onClick={handleChargeClickChild}
                              >
                                Charge
                              </Button>
                            )}
                          </Space>
                          {!isFreeChild && (
                            <InputNumber
                              {...field}
                              formatter={(value) =>
                                new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(value)
                              }
                              parser={(value) => value.replace(/[^\d]/g, "")}
                              placeholder="Enter child charge"
                              style={{ width: "100%" }}
                              readOnly={selectedRoom?.childCharge !== 0}
                            />
                          )}
                        </Space>
                      </Form.Item>
                    )}
                  />

                  <Form.Item label="Quantity Baby">
                    <Input value={selectedRoom?.quantityBaby} readOnly />
                  </Form.Item>

                  <Controller
                    name="babyCharge"
                    control={control}
                    defaultValue={0}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Baby Charge / Person"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Space
                            direction="horizontal"
                            style={{ width: "100%" }}
                          >
                            {isFreeBaby && (
                              <Button
                                size="middle"
                                type={isFreeBaby ? "primary" : "default"}
                                onClick={handleFreeClickBaby}
                              >
                                Free
                              </Button>
                            )}

                            {!isFreeBaby && (
                              <Button
                                size="middle"
                                type={!isFreeBaby ? "primary" : "default"}
                                onClick={handleChargeClickBaby}
                              >
                                Charge
                              </Button>
                            )}
                          </Space>
                          {!isFreeBaby && (
                            <InputNumber
                              {...field}
                              formatter={(value) =>
                                new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(value)
                              }
                              parser={(value) => value.replace(/[^\d]/g, "")}
                              placeholder="Enter baby charge"
                              style={{ width: "100%" }}
                              readOnly={selectedRoom?.childBaby !== 0}
                            />
                          )}
                        </Space>
                      </Form.Item>
                    )}
                  />

                  <Form.Item label="Active Status">
                    <Input value={selectedRoom?.activeStatus} readOnly />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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

                  <Form.Item label="Default Price">
                    <InputNumber
                      value={selectedRoom?.defaultPrice}
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

                  <Form.Item label="Weekday Price">
                    <InputNumber
                      value={selectedRoom?.weekdayPrice}
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

                  <Form.Item label="Weekend Price">
                    <InputNumber
                      value={selectedRoom?.weekendPrice}
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

                  <Form.Item label="Holidays">
                    <DatePicker
                      defaultValue={defaultValuesDatePicker}
                      multiple
                      onChange={onChangeHolidays}
                      maxTagCount="responsive"
                      disabled
                    />
                  </Form.Item>

                  {holidays?.map((holiday, index) => (
                    <Form.Item key={index} label={`Price for ${holiday}`}>
                      <InputNumber
                        formatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(value)
                        }
                        parser={(value) => value.replace(/[^\d]/g, "")}
                        placeholder={`Enter price for ${holiday}`}
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handlePriceChange(holiday, value)}
                        value={
                          holidaysData.find((h) => h.date === holiday)?.price ||
                          ""
                        }
                        readOnly
                      />
                    </Form.Item>
                  ))}

                  <Form.Item label="Discount">
                    <InputNumber
                      value={selectedRoom?.discount}
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
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ViewARoom;
