import {
  Col,
  Row,
  Grid,
  Breadcrumb,
  Button,
  Rate,
  Avatar,
  DatePicker,
  TimePicker,
  Timeline,
  Input,
  Table,
  InputNumber,
  Image,
  Select,
  Modal,
  Form,
  notification,
  Spin,
  Tag,
} from "antd";
import category1 from "../../assets/images/category-1.jpg";
import category2 from "../../assets/images/category-2.jpg";
import category3 from "../../assets/images/category-3.png";
import CustomText from "../common/CustomText";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChild,
  faDog,
  faHotel,
  faLocationDot,
  faPersonBreastfeeding,
  faPhone,
  faPhoneVolume,
  faVolumeHigh,
  faWheelchair,
  faUser,
  faTv,
  faWifi,
  faMugSaucer,
  faCar,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

import {
  faHeart,
  faCalendar,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { getHotelById, getRoomById } from "../../features/hotel/HotelSlice";
import {
  createHotelReview,
  getHotelReviewsByHotelId,
} from "../../features/review/ReviewSlice";
import { getInfoCustomer } from "../../features/customer/CustomerSlice";
import { useEffect, useState } from "react";
import { roomBooking } from "../../features/hotel/HotelSlice";
import { Controller, useForm } from "react-hook-form";
import { createWishlist } from "../../features/wishlist/WishlistSlice";
dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function Detail({ userId, hotel, reviews }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hotelId } = useParams();

  const sub = useSelector((state) => state.auth?.info?.sub);
  const selectedRoomRedux = useSelector((state) => state.hotels?.selectedRoom);
  const selectedHotel = useSelector((state) => state.hotels?.selectedHotel);

  const customerName = useSelector(
    (state) => state.customer?.info?.customer?.name
  );

  const customerEmail = useSelector((state) => state.customer?.info?.email);

  const roomBookings = useSelector(
    (state) => state.customer?.info?.roomBookings
  );

  const listRoomOfHotel = useSelector(
    (state) => state.hotels?.selectedHotel?.rooms
  );

  const roomDetailBookings = useSelector(
    (state) => state.hotels?.selectedRoom?.roomBookings
  );

  console.log("roomBookings: ", roomBookings);
  console.log("listRoomOfHotel: ", listRoomOfHotel);

  const [quantityAdults, setQuantityAdults] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [quantityBaby, setQuantityBaby] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalAmountRoom, setTotalAmountRoom] = useState(null);
  const [dataTourRoomBooking, setDataTourRoomBooking] = useState(null);
  const [errorRoomTypes, setErrorRoomTypes] = useState(null);
  const [errorCheckTime, setErrorCheckTime] = useState(null);

  // Ant Design
  const screens = useBreakpoint();

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  function checkRoomBookingInHotel() {
    // Lặp qua từng phần tử trong roomBookings
    for (let i = 0; i < roomBookings?.length; i++) {
      let booking = roomBookings[i];
      let bookingRoomId = booking?.roomId;
      let bookingReviewType = booking?.reviewStatus;

      // Nếu reviewType của booking là PROVIDED thì bỏ qua và tiếp tục vòng lặp
      if (bookingReviewType === "PROVIDED") {
        continue;
      }

      // Kiểm tra từng phần tử trong listRoomOfHotel
      for (let j = 0; j < listRoomOfHotel?.length; j++) {
        let room = listRoomOfHotel[j];
        let roomId = room.id;

        // So sánh roomId của booking và id của room
        if (bookingRoomId === roomId) {
          return true; // Nếu trùng thì trả về true
        }
      }
    }

    return false;
  }

  const handleNavigateCheckout = (roomId) => {
    if (selectedRoomRedux === null) {
      setErrorRoomTypes("Please choose room type");
      return;
    }

    if (dataTourRoomBooking === null) {
      setErrorCheckTime("Please choose checkin - checkout time");
      return;
    }

    if (sub) {
      dispatch(roomBooking(dataTourRoomBooking));
      navigate(`/hotels/checkout/${roomId}`);
    } else {
      navigate("/login");
    }
  };

  const isDateInRange = (date, startDate, endDate) => {
    const dateTime = date.getTime();
    return dateTime >= startDate.getTime() && dateTime <= endDate.getTime();
  };

  const disabledDate = (current) => {
    if (!current) return false;

    const currentDate = new Date(current);
    currentDate.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây và mili giây về 0

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable ngày quá khứ và hiện tại
    if (currentDate < today) {
      console.log("Date is in the past or today, disabling:", currentDate);
      return true;
    }

    // Disable các ngày nằm trong phạm vi của bookings, bao gồm cả startDate và endDate
    for (const booking of roomDetailBookings) {
      const startDate = new Date(booking.startDate);
      startDate.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây và mili giây về 0

      const endDate = new Date(booking.endDate);
      endDate.setHours(0, 0, 0, 0); // Thiết lập giờ, phút, giây và mili giây về 0

      if (
        currentDate.getTime() === startDate.getTime() ||
        isDateInRange(currentDate, startDate, endDate)
      ) {
        return true;
      }
    }

    return false;
  };

  const [durationDays, setDurationDays] = useState(null);

  const onChangeDatePicker = (
    dates,
    dateStrings,
    roomId,
    discount,
    price,
    roomType,
    roomNumber
  ) => {
    const startDate = dateStrings?.[0];
    const endDate = dateStrings?.[dateStrings.length - 1];
    const durationDays = dates ? dates[1].diff(dates[0], "days") + 1 : 0;

    setDurationDays(durationDays);

    const totalAmount = durationDays * price;

    setTotalAmountRoom(totalAmount);

    const newRoom = {
      roomId: roomId,
      roomType: roomType,
      roomNumber: roomNumber,
      startDate: startDate,
      endDate: endDate,
      discount: discount,
      price: price,
      totalAmount: totalAmount,
      hotelName: selectedHotel.name,
    };

    setDataTourRoomBooking(newRoom);

    setErrorCheckTime(null);

    console.log("dateStrings: ", dateStrings);
    console.log("durationDays: ", durationDays);
    console.log("totalAmount: ", totalAmount);
  };

  const handleGetRoomById = (roomId) => {
    dispatch(getRoomById(roomId));

    setErrorRoomTypes(null);
  };

  const [isModalShowReviewOpen, setIsModalShowReviewOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleShowReview = () => {
    setIsModalShowReviewOpen(true);
  };

  const handleSubmitReview = async (data) => {
    const newData = {
      userId: userId,
      hotelId: parseInt(hotelId),
      roomBookingId: data.roomBookingId,
      customerName: customerName,
      content: data.content,
      rating: data.rating,
    };

    console.log("newData: ", newData);

    setLoadingButton(true);

    try {
      const action = await dispatch(createHotelReview(newData));

      console.log("action: ", action);

      if (createHotelReview.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Review submitted successfully",
            description: "Your review has been successfully submitted.",
          });
          setIsModalShowReviewOpen(false);
          reset();
          dispatch(getInfoCustomer(userId));
          dispatch(getHotelById(hotel?.id));
          dispatch(getHotelReviewsByHotelId(hotel?.id));
        } else {
          const error = action?.payload?.error.message || "Unknown error";
          notification.error({
            message: "Review submission error",
            description: error,
          });
        }
      } else if (createHotelReview.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Review submission error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System error",
        description:
          "The server couldn't fulfill a valid request due to an issue with the server.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleCancelReview = () => {
    setIsModalShowReviewOpen(false);
  };

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  const [isWeekend, setIsWeekend] = useState(null);

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

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const day = String(today.getDate()).padStart(2, "0");

    console.log(`${year}-${month}-${day}`);

    return `${year}-${month}-${day}`;
  };

  const handleAddWishlist = async (hotelId) => {
    if (!userId) {
      alert("Please login before adding to wishlists");
      navigate("/login");
      return;
    }
    const newData = {
      name: hotel?.name,
      rating: hotel?.rating,
      numberOfRating: hotel?.numberOfRating,
      price: "CONTACT",
      description: hotel?.description,
      thumbnail: hotel?.thumbnailUrls?.[0],
      type: "HOTEL",
      itemId: hotel?.id,
      userId: userId,
    };

    console.log("newData: ", newData);

    try {
      const action = await dispatch(createWishlist(newData));

      console.log("action: ", action);

      if (createWishlist.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Add item to wishlist successful",
            description: "Successfully added the item to your wishlist",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error";
          notification.error({
            message: "Add item to wishlist error",
            description: error,
          });
        }
      } else if (createWishlist.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Add item to wishlist error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System error",
        description:
          "The server couldn't fulfill a valid request due to an issue with the server.",
      });
    }
  };

  const [selectedImage, setSelectedImage] = useState(hotel?.thumbnailUrls?.[0]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <>
      <Modal
        title={
          <CustomText size={"20px"} weight={"500"} color={"var(--black-text)"}>
            Write your review
          </CustomText>
        }
        open={isModalShowReviewOpen}
        // onOk={handleSubmitReview}
        onCancel={handleCancelReview}
        footer={false}
      >
        <Form onFinish={handleSubmit(handleSubmitReview)} layout="vertical">
          <Form.Item label="Name">
            <Input value={customerName} readOnly />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={customerEmail} readOnly />
          </Form.Item>

          {/* <Form.Item label="Room Types">
            <Input value={"Single Room"} readOnly />
          </Form.Item> */}

          <Controller
            name="roomBookingId"
            control={control}
            // rules={{ required: "Room type is required" }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Room Bookings"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Select
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  placeholder="Choose room type"
                  style={{
                    width: "100%",
                  }}
                >
                  {roomBookings
                    ?.filter(
                      (roomBooking) =>
                        roomBooking?.reviewStatus === "NOT_PROVIDED"
                    )
                    .map((roomBooking) => (
                      <Option key={roomBooking?.id} value={roomBooking?.id}>
                        {roomBooking?.roomType} - {roomBooking?.roomNumber}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Content"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input.TextArea {...field} placeholder="Write your review" />
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
                <Rate {...field} />
              </Form.Item>
            )}
          />

          <Form.Item
            style={{
              marginBottom: 20,
              textAlign: "right",
            }}
          >
            <Button
              htmlType="submit"
              style={{
                background: "var(--green-dark)",
                color: "var(--white)",
                // width: "100%",
              }}
              icon={loadingButton ? <Spin /> : null}
              loading={loadingButton}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Row
        style={{
          width: "100%",
          height: "auto",
          background: "white",
          padding: "0",
          borderBottom: "1px solid var(--border)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "white",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "auto",
              padding: "12px 0",
              background: "white",
            }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/"}
                    >
                      <FontAwesomeIcon icon={faLocationDot} /> Home
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/tours"}
                    >
                      Hotels
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                    >
                      {hotel?.name}
                    </CustomText>
                  ),
                },
              ]}
            />
          </Row>
        </Row>
      </Row>

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
          gutter={16}
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px 0",
          }}
          justify={"space-between"}
        >
          {/* Col content */}
          <Col span={16}>
            {/* Images */}
            <Row
              style={{
                width: "100%",
                padding: "0 0 20px 0",
              }}
              justify="space-between"
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText size="22px" weight="500" color="var(--gray-text)">
                  Images
                </CustomText>
              </Col>

              <Col span={18}>
                <Col
                  span={24}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  <Image
                    src={selectedImage}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "3px",
                    }}
                  />
                </Col>

                <Row
                  gutter={[10, 10]}
                  style={{
                    width: "100%",
                  }}
                >
                  {hotel?.thumbnailUrls?.map((thumb, index) => (
                    <Col key={index} span={6}>
                      <Image
                        src={thumb}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "3px",
                          cursor: "pointer",
                          border:
                            thumb === selectedImage
                              ? "2px solid var(--pink)"
                              : "none",
                        }}
                        preview={false}
                        onClick={() => handleImageClick(thumb)}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>

            {/* Description */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
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
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Description
                </CustomText>
              </Col>

              <Col
                span={18}
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
                  color={"var(--gray-light)"}
                >
                  {hotel?.description}
                </CustomText>
              </Col>
            </Row>

            {/* Utilities */}
            <Row
              style={{
                width: "100%",
                borderBottom: "2px solid var(--gray-light)",
              }}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faTv}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  TV
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faWifi}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Wifi
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faMugSaucer}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Breakfast
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faWheelchair}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Accessibiliy
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faDog}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Pet allowed
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faCar}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Parking
                </CustomText>
              </Col>
            </Row>

            {/* Room List */}
            <Row
              style={{
                width: "100%",
                height: "auto",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
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
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Room List
                </CustomText>
              </Col>

              <Col
                span={18}
                style={{
                  padding: "10px 0",
                }}
              >
                {hotel?.rooms?.map((room) => (
                  <Col
                    key={room?.id}
                    span={24}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      alignItems: "start",
                      gap: "15px",
                      padding: "5px 0 30px 0",
                    }}
                  >
                    <CustomText
                      size={"18px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {room?.type}
                    </CustomText>

                    {/* <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-light)"}
                    >
                      Category: <Tag color="var(--pink)">{room?.category} </Tag>
                    </CustomText> */}

                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-light)"}
                    >
                      Number: {room?.roomNumber}
                    </CustomText>

                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-light)"}
                    >
                      Discount:{" "}
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--gray-light)"}
                        isItalic={true}
                        isStrikethrough={true}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(room?.discount)}
                      </CustomText>
                    </CustomText>

                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-light)"}
                    >
                      Price:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        room?.roomHolidays?.find(
                          (holiday) => holiday.date === getCurrentDate()
                        )?.price - room?.discount ||
                          (isWeekend
                            ? room?.weekendPrice +
                              room?.childCharge +
                              room?.childBaby
                            : room?.weekdayPrice +
                              room?.childCharge +
                              room?.babyCharge) - room?.discount
                      )}
                    </CustomText>

                    <Col>
                      {/* Slot */}
                      <Col span={24}>
                        <CustomText
                          size={"14px"}
                          weight={"400"}
                          color={"var(--gray-light)"}
                        >
                          Number of People:
                        </CustomText>{" "}
                        <Tag color="var(--green-dark)">
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--white)"}
                          >
                            <FontAwesomeIcon icon={faUser} /> (
                            {room?.quantityAdult})
                          </CustomText>
                        </Tag>
                        <Tag color="var(--green-dark)">
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--white)"}
                          >
                            <FontAwesomeIcon icon={faChild} /> (
                            {room?.quantityChild === 0
                              ? "Free"
                              : room?.quantityChild}
                            )
                          </CustomText>
                        </Tag>
                        <Tag color="var(--green-dark)">
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--white)"}
                          >
                            <FontAwesomeIcon icon={faPersonBreastfeeding} /> (
                            {room?.quantityBaby === 0
                              ? "Free"
                              : room?.quantityBaby}
                            )
                          </CustomText>
                        </Tag>
                      </Col>
                    </Col>

                    <Row
                      gutter={[10, 10]}
                      style={{
                        width: "100%",
                      }}
                    >
                      {room?.imageUrls?.map((thumb, index) => (
                        <Col key={index} span={6}>
                          <Image
                            src={thumb}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "3px",
                            }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Col>
                ))}
              </Col>
            </Row>

            {/* Reivews */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "10px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Reviews
                </CustomText>

                <Button
                  size="large"
                  className="hover-button"
                  style={{
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  disabled={!checkRoomBookingInHotel()}
                  onClick={handleShowReview}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Leave a review
                  </CustomText>
                </Button>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <Row>
                  <CustomText
                    size={"18px"}
                    weight={"400"}
                    color={"var(--gray-light)"}
                  >
                    {hotel?.numberOfRating} Star{" "}
                    <Rate
                      disabled
                      value={hotel?.rating}
                      style={{
                        fontSize: "15px",
                        color: "var(--orange)",
                      }}
                    />
                  </CustomText>
                </Row>

                {reviews &&
                  reviews.length > 0 &&
                  reviews?.map((review) => (
                    <Row
                      style={{
                        width: "100%",
                        padding: "20px 0",
                      }}
                    >
                      <Row
                        justify={"space-between"}
                        style={{
                          width: "100%",
                          padding: "20px 0",
                        }}
                      >
                        <Col>
                          <Avatar
                            size={60}
                            icon={<UserOutlined />}
                            style={{
                              marginRight: "10px",
                            }}
                          />
                          <CustomText
                            size={"18px"}
                            weight={"500"}
                            color={"var(--black-light)"}
                          >
                            {review?.customerName}
                          </CustomText>
                        </Col>

                        <Col>
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--black-light)"}
                            isItalic={true}
                          >
                            {new Date(review?.createdAt).toLocaleString()}
                          </CustomText>
                        </Col>
                      </Row>

                      <Row
                        justify={"space-between"}
                        style={{
                          width: "100%",
                        }}
                      >
                        <Col>
                          <CustomText
                            size={"14px"}
                            weight={"400"}
                            color={"var(--black-light)"}
                          >
                            {review?.content}
                          </CustomText>
                        </Col>
                      </Row>

                      <Row
                        justify={"space-between"}
                        style={{
                          width: "100%",
                          padding: "20px 0",
                          borderBottom: "2px solid var(--border)",
                        }}
                      >
                        <Col>
                          <Rate
                            value={review?.rating}
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "15px !important",
                            }}
                          />
                        </Col>
                      </Row>
                    </Row>
                  ))}
              </Col>
            </Row>
          </Col>

          {/* Col booking */}
          <Col
            span={8}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Row
              style={{
                width: "100%",
                border: "1px solid var(--border)",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  background: "var(--gray-mid)",
                  padding: "10px 20px",
                  textAlign: "center",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                }}
              >
                <CustomText size={"22px"} weight={"600"} color={"var(--white)"}>
                  Check Availability
                </CustomText>
              </Col>
              <Row
                style={{
                  width: "100%",
                  padding: "30px",
                  background: "var(--white)",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                }}
              >
                {/* Checkin and checkout */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={24}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faDoorOpen}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-text)",
                          marginRight: "5px",
                        }}
                      />
                      Room Types
                    </CustomText>

                    <Select
                      onChange={(value) => {
                        handleGetRoomById(value);
                        setSelectedRoom(value);
                      }}
                      placeholder="Choose room type"
                      style={{
                        width: "100%",
                      }}
                    >
                      {hotel?.rooms.map((room) => {
                        return (
                          <Option key={room?.id} value={room?.id}>
                            {`${room?.type} - ${room?.category} - Number ${room?.roomNumber}`}
                          </Option>
                        );
                      })}
                    </Select>
                    {errorRoomTypes && (
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--pink)"}
                      >
                        {errorRoomTypes}
                      </CustomText>
                    )}
                  </Col>
                </Row>

                {/* Checkin and checkout */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={24}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faCalendar}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-text)",
                          marginRight: "5px",
                        }}
                      />
                      Checkin / Checkout
                    </CustomText>

                    <RangePicker
                      disabled={selectedRoomRedux === null}
                      disabledDate={disabledDate}
                      onChange={(dates, dateStrings) => {
                        const holidayPrice =
                          selectedRoomRedux?.roomHolidays?.find(
                            (holiday) => holiday.date === getCurrentDate()
                          )?.price;

                        const basePrice = isWeekend
                          ? selectedRoomRedux?.weekendPrice
                          : selectedRoomRedux?.weekdayPrice;
                        const finalPrice =
                          holidayPrice ||
                          basePrice - selectedRoomRedux?.discount;

                        onChangeDatePicker(
                          dates,
                          dateStrings,
                          selectedRoomRedux?.id,
                          selectedRoomRedux?.discount,
                          finalPrice,
                          selectedRoomRedux?.type,
                          selectedRoomRedux?.roomNumber
                        );
                      }}
                    />

                    {errorCheckTime && (
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--pink)"}
                      >
                        {errorCheckTime}
                      </CustomText>
                    )}
                  </Col>
                </Row>

                {/* Discount */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Discount
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(selectedRoomRedux?.discount || 0)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Days */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Days
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {durationDays || 0}
                    </CustomText>
                  </Col>
                </Row>

                {/* Total price */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Total price
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        selectedRoomRedux?.roomHolidays?.find(
                          (holiday) => holiday.date === getCurrentDate()
                        )?.price - selectedRoomRedux?.discount ||
                          (isWeekend
                            ? selectedRoomRedux?.weekendPrice
                            : selectedRoomRedux?.weekdayPrice) -
                            selectedRoomRedux?.discount ||
                          0
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Total amount */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"16px"}
                      weight={"600"}
                      color={"var(--gray-text)"}
                    >
                      Total amount
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"16px"}
                      weight={"600"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(dataTourRoomBooking?.totalAmount || 0)}
                    </CustomText>
                  </Col>
                </Row>

                <Button
                  htmlType="submit"
                  size="large"
                  className="hover-button"
                  onClick={() => handleNavigateCheckout(selectedRoomRedux?.id)}
                  style={{
                    width: "100%",
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                    isUppercase={true}
                  >
                    Book now
                  </CustomText>
                </Button>

                <Button
                  htmlType="submit"
                  size="large"
                  // className="hover-button"
                  style={{
                    width: "100%",
                    background: "var(--white)",
                    border: "2px solid var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddWishlist(parseInt(hotelId))}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--green-dark)"}
                    isButton={true}
                    isUppercase={true}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    Add to whislist
                  </CustomText>
                </Button>
              </Row>
            </Row>

            <Row
              style={{
                width: "100%",
                border: "1px solid var(--border)",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  padding: "30px",
                  background: "var(--white)",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                >
                  <FontAwesomeIcon
                    icon={faPhoneVolume}
                    style={{
                      fontSize: "52px",
                      color: "var(--pink)",
                    }}
                  />
                </CustomText>
                <CustomText
                  size={"20px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Book my phone
                </CustomText>
                <CustomText
                  size={"26px"}
                  weight={"400"}
                  color={"var(--green-dark)"}
                >
                  +45 423 445 99
                </CustomText>
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                >
                  Monday to Friday 9.00am - 7.30pm
                </CustomText>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
}
