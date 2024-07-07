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
import { useParams } from "react-router-dom";
import { roomTypes } from "../../utils/enums/RoomTypes";
import { getAllHotels, getRoomById } from "../../features/hotel/HotelSlice";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const UpdateTour = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const { tourId } = useParams();
  const dispatch = useDispatch();
  const hotels = useSelector((state) => state.hotels?.list);
  const tour = useSelector((state) => state.tours?.selectedTour);
  const selectedRoom = useSelector((state) => state.hotels?.selectedRoom);
  const scheduleId = useSelector(
    (state) => state.tours?.selectedTour?.scheduleId
  );
  const isLoading = useSelector((state) => state.tours?.isLoading);
  const error = useSelector((state) => state.tours?.error);

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

  console.log("schedules: ", schedules);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getTourById(tourId));

    dispatch(
      getAllHotels({
        page: INIT_PAGE,
        limit: INIT_LIMIT,
        search: "",
      })
    );

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (tour) {
      reset({
        name: tour?.name,
        description: tour?.description,
        depart: tour?.depart,
        startTime: tour?.startTime,
        price: tour?.price,
        discount: tour?.discount,
        locations: tour?.locations,
        bookedStatus: tour?.bookedStatus,
        activeStatus: tour?.activeStatus,
        adults: tour?.adults,
        children: tour?.children,
        baby: tour?.baby,
      });

      const startDate = dayjs(tour?.schedules[0]?.date, "YYYY-MM-DD");

      const endDate = dayjs(
        tour?.schedules[tour?.schedules?.length - 1]?.date,
        "YYYY-MM-DD"
      );

      setDates([startDate, endDate]);

      console.log("dates: ", dates);

      const weekdays = tour?.schedules;
      setWeekdays(weekdays);

      console.log("weekdays :", weekdays);

      if (!isLoading) {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      }
    }
  }, [tour]);

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
    if (dates?.[0] === null && dates?.[1] === null) {
      setErrorDatePicker("Please select a date time");

      return;
    }

    setLoadingButton(true);

    let thumbnailToUse = selectedImage ? await uploadImage() : tour?.thumbnail;

    const newData = {
      id: tourId,
      name: data.name,
      description: data.description,
      depart: data.depart,
      price: parseInt(data.price),
      discount: parseInt(data.discount) || 0.0,
      locations: data.locations,
      adults: data.adults,
      children: data.children,
      baby: data.baby,
      bookedStatus: data.bookedStatus,
      activeStatus: data.activeStatus,
      thumbnail: thumbnailToUse,
      schedules: weekdays,
    };

    console.log("newData: ", newData);

    try {
      console.log("newData: ", newData);

      const token = Cookies.get("token");

      await axios.put(`http://localhost:5050/api/v1/tours/${tourId}`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(getTourById(tourId));
      setIsChangeImage(false);
      resetFileInput();

      notification.success({
        message: "Tour updated successfully",
        description: "Tour updated successfully.",
      });
    } catch (error) {
      console.error("Error creating tour:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const disabledDate = (current) => {
    // Chỉ cho phép chọn ngày trong tương lai và không cho phép chọn ngày hiện tại
    return current && current < Date.now();
  };

  const getWeekdaysInRange = (startDate, endDate) => {
    const weekdays = [];
    let currentDate = dayjs(startDate);

    while (currentDate.isBefore(dayjs(endDate).add(1, "day"))) {
      weekdays.push({
        dayOfWeek: currentDate.format("dddd"), // Tên thứ trong tuần
        date: currentDate.format("YYYY-MM-DD"), // Ngày tháng năm
      });
      currentDate = currentDate.add(1, "day"); // Tăng ngày lên 1
    }

    return weekdays;
  };

  const handleRangePickerChange = (dates, dateStrings) => {
    setErrorDatePicker("");

    setStartDate(dateStrings?.[0]);
    setEndDate(dateStrings?.[1]);

    setDates(dates);

    const weekdays = getWeekdaysInRange(dateStrings[0], dateStrings[1]);
    setWeekdays(weekdays);
    console.log("Weekdays:", weekdays); // In ra mảng các thứ tiếng Anh từ ngày bắt đầu đến ngày kết thúc (bao gồm cả ngày kết thúc)

    // const initialDataSource = weekdays.map((day) => ({
    //   key: day,
    //   data: [],
    // }));

    // setDataSource(initialDataSource);

    // // Tạo object schedules mới
    // const newSchedules = {
    //   startDay: dateStrings?.[0],
    //   endDay: dateStrings?.[1],
    //   weeks: {},
    // };

    // // Thêm các thông tin ban đầu cho mỗi ngày trong tuần vào weeks
    // weekdays.forEach((day) => {
    //   newSchedules.weeks[day] = [];
    // });

    // // Cập nhật state cho schedules
    // setSchedules(newSchedules);
  };

  const handleAddRow = (dayIndex) => {
    const newData = {
      key: `${weekdays[dayIndex]}-${count + 1}`,
      startHour: null,
      endHour: null,
      activities: "",
    };

    const addActivityTimeSlot = (day, type, value) => {
      console.log(`Time changed for ${day}, ${type}: ${value}`);
      addActivityTimeSlot(day, type, value);
    };

    const dayKey = weekdays[dayIndex];
    const updatedDataSource = [...dataSource];
    const dayDataIndex = updatedDataSource.findIndex(
      (data) => data.key === dayKey
    );

    if (dayDataIndex !== -1) {
      updatedDataSource[dayDataIndex].data = [
        ...updatedDataSource[dayDataIndex].data,
        newData,
      ];
      setDataSource(updatedDataSource);

      // Update schedules
      const updatedSchedules = { ...schedules };
      const updatedWeeks = [...updatedSchedules.weeks[dayKey]];

      updatedWeeks.push({
        startHour: null,
        endHour: null,
        activities: "",
      });

      updatedSchedules.weeks[dayKey] = updatedWeeks;
      setSchedules(updatedSchedules);
    } else {
      setDataSource([
        ...dataSource,
        {
          key: dayKey,
          data: [newData],
        },
      ]);

      // Update schedules
      const updatedSchedules = { ...schedules };
      updatedSchedules.weeks[dayKey] = [
        {
          startHour: null,
          endHour: null,
          activities: "",
        },
      ];

      setSchedules(updatedSchedules);
    }

    setCount(count + 1);
  };

  const handleTimeChange = (value, fieldName, day, dataIndex) => {
    const updatedSchedules = { ...schedules };
    const [weekday, index] = day.split("-");

    if (updatedSchedules.weeks.hasOwnProperty(weekday)) {
      // Finding the index of the dataIndex within the weekday's array
      const dayDataIndex = updatedSchedules.weeks[weekday].findIndex(
        (item, idx) => idx === dataIndex
      );

      if (dayDataIndex !== -1) {
        // Updating the specific field in the schedules
        updatedSchedules.weeks[weekday][dayDataIndex][fieldName] = value;
        setSchedules(updatedSchedules);
      } else {
        console.log(`Data index ${dataIndex} not found in ${weekday}`);
      }
    } else {
      console.log(`Weekday ${weekday} not found in schedules`);
    }
  };

  const handleInputChange = (value, day, dataIndex) => {
    const updatedSchedules = { ...schedules };
    const [weekday, index] = day.split("-");

    if (updatedSchedules.weeks.hasOwnProperty(weekday)) {
      // Finding the index of the dataIndex within the weekday's array
      const dayDataIndex = updatedSchedules.weeks[weekday].findIndex(
        (item, idx) => idx === dataIndex
      );

      if (dayDataIndex !== -1) {
        // Updating the specific field in the schedules
        updatedSchedules.weeks[weekday][dayDataIndex].activities = value;
        setSchedules(updatedSchedules);
      } else {
        console.log(`Data index ${dataIndex} not found in ${weekday}`);
      }
    } else {
      console.log(`Weekday ${weekday} not found in schedules`);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImage(null);
  };

  const handleResetPicker = () => {
    setDates([null, null]);
  };

  const handleShowChangeImage = () => {
    setIsChangeImage(!isChangeImage);
  };

  const columns = [
    {
      title: "Start hour",
      dataIndex: "startHour",
      key: "startHour",
      render: (_, record, dataIndex) => (
        <TimePicker
          onChange={(time, timeString) => {
            handleTimeChange(timeString, "startHour", record.key, dataIndex);
          }}
          // defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
          defaultValue={
            record.startHour ? dayjs(record.startHour, "HH:mm:ss") : null
          }
        />
      ),
    },
    {
      title: "End hour",
      dataIndex: "endHour",
      key: "endHour",
      render: (_, record, dataIndex) => (
        <TimePicker
          onChange={(time, timeString) =>
            handleTimeChange(timeString, "endHour", record.key, dataIndex)
          }
          // defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
          defaultValue={
            record.endHour ? dayjs(record.endHour, "HH:mm:ss") : null
          }
        />
      ),
    },
    {
      title: "Activities",
      dataIndex: "activities",
      key: "activities",
      render: (_, record, dataIndex) => (
        <Input
          placeholder="Enter activities"
          onChange={(e) =>
            handleInputChange(e.target.value, record.key, dataIndex)
          }
          defaultValue={record.activities || ""}
        />
      ),
    },
  ];

  const handleActivitiesChange = (index, value) => {
    // Sao chép mảng weekdays để không làm thay đổi trực tiếp state
    const updatedWeekdays = [...weekdays];

    // Cập nhật giá trị activities tương ứng
    updatedWeekdays[index] = {
      ...updatedWeekdays[index],
      activities: value,
    };

    // Cập nhật state weekdays
    setWeekdays(updatedWeekdays);
  };

  const optionsHotels = hotels?.map((hotel) => ({
    value: hotel.id,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={hotel.thumbnailUrls[0]}
          alt={hotel.name}
          style={{ width: 24, height: 24, marginRight: 10 }}
        />
        <p>{hotel.name}</p>
      </div>
    ),
    name: hotel.name,
  }));

  const handleChangeSelectHotels = (value) => {
    console.log(`selectedHotels: `, selectedHotels);
    setSelectedHotels(value);
  };

  const handleTagClick = (hotelId) => {
    const selectedHotel = hotels.find((hotel) => hotel.id === hotelId);
    if (selectedHotel) {
      setSelectedHotelRooms(selectedHotel.rooms);
      setHasRooms(selectedHotel.rooms.length > 0);
      setModalVisibleRooms(true);
    }
  };

  const disabledTime = (tourRoomBookings) => {
    return (current) => {
      const currentDate = current.format("YYYY-MM-DD");

      // Find all bookings that match the current date
      const bookings = tourRoomBookings.filter((booking) =>
        booking.date.includes(currentDate)
      );

      // Initialize an array to hold disabled hours
      let disabledHours = [];

      // Iterate through each booking to disable hours within the range
      bookings.forEach((booking) => {
        const { startHour, endHour } = booking;

        // Parse the start and end hours from the booking
        const startHourInt = parseInt(startHour.slice(0, 2));
        const endHourInt = parseInt(endHour.slice(0, 2));

        // Add hours to the disabledHours array
        for (let hour = startHourInt; hour <= endHourInt; hour++) {
          disabledHours.push(hour);
        }
      });

      // Return an object with disabledHours function if there are disabled hours, otherwise an empty object
      return disabledHours.length > 0
        ? { disabledHours: () => disabledHours }
        : {};
    };
  };

  const onChangeDatePicker = (dates, dateStrings, roomId, pricePerHour) => {
    if (dateStrings && dateStrings.length === 2) {
      const startHour = dateStrings[0].split(" ")[1];
      const endHour = dateStrings[1].split(" ")[1];

      const startTime = dayjs(dateStrings[0]);
      const endTime = dayjs(dateStrings[1]);
      const durationHours = endTime.diff(startTime, "hours");

      const price = durationHours * pricePerHour;

      setTotalPriceRoom(price);

      // Find hotelId based on roomId
      let hotelId = null;
      hotels.forEach((hotel) => {
        const room = hotel.rooms.find((r) => r.id === roomId);

        if (room) {
          hotelId = hotel.id;
        }
      });

      // const startDate = dates[0].format("YYYY-MM-DD");
      // const endDate = dates[1].format("YYYY-MM-DD");

      if (hotelId) {
        const newRoom = {
          tourId: parseInt(tourId),
          roomId: roomId,
          date: dates[0].format("YYYY-MM-DD"),
          startHour: startHour,
          endHour: endHour,
          price: price,
        };

        setDataTourRoomBooking(newRoom);

        console.log("Updated newdata with new room:", newRoom);
      } else {
        console.log(`Hotel not found for roomId: ${roomId}`);
      }
    }
  };

  const handleTourRoomBooking = async () => {
    setLoadingButtonTourRoomBooking(true);

    console.log("dataTourRoomBooking: ", dataTourRoomBooking);

    try {
      await dispatch(tourRoomBooking(dataTourRoomBooking));

      dispatch(getTourById(tourId));
      dispatch(getRoomById(selectedRoom?.id));
      setIsModalTourRoomBooking(false);
      setTotalPriceRoom(null);

      notification.success({
        message: "Tour room booking successfully",
        description: "Tour room booking successfully.",
      });
    } catch (error) {
      console.error("Error creating tour:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButtonTourRoomBooking(false);
    }
  };

  const showModalTourRoomBooking = (roomId) => {
    dispatch(getRoomById(roomId));

    setIsModalTourRoomBooking(true);
  };

  const handleOkTourRoomBooking = () => {
    setIsModalTourRoomBooking(false);
  };

  const handleCancelTourRoomBooking = () => {
    setIsModalTourRoomBooking(false);
    setTotalPriceRoom(null);
  };

  const onSubmitTourRoomBooking = (data) => {
    console.log(data);
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
          </Col>
          <Col xl={24}>
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
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
                    name="locations"
                    control={control}
                    rules={{ required: "Locations is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Locations"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="depart"
                    control={control}
                    rules={{ required: "Depart is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Depart"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="price"
                    control={control}
                    rules={{ required: "Price is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Price"
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
                    name="discount"
                    control={control}
                    rules={{ required: "Discount is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Discount"
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

                  <Row gutter={16} justify={"space-between"}>
                    <Col span={7}>
                      <Controller
                        name="adults"
                        control={control}
                        rules={{
                          required: "Adults is required",
                          validate: {
                            min: (value) =>
                              value >= 5 || "Minimum adults is 5 people",
                            max: (value) =>
                              value <= 30 || "Maximum adults is 30 people",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Adults"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <InputNumber
                              {...field}
                              min={5}
                              max={30}
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={7}>
                      <Controller
                        name="children"
                        control={control}
                        rules={{
                          required: "Children is required",
                          validate: {
                            min: (value) =>
                              value >= 0 || "Minimum children is 0 people",
                            max: (value) =>
                              value <= 10 || "Maximum children is 10 people",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Children"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <InputNumber
                              {...field}
                              min={0}
                              max={10}
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={7}>
                      <Controller
                        name="baby"
                        control={control}
                        rules={{
                          required: "Baby is required",
                          validate: {
                            min: (value) =>
                              value >= 0 || "Minimum baby is 0 people",
                            max: (value) =>
                              value <= 10 || "Maximum baby is 10 people",
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Baby"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <InputNumber
                              {...field}
                              min={0}
                              max={10}
                              style={{
                                width: "100%",
                              }}
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                  </Row>

                  <Controller
                    name="bookedStatus"
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
                          {bookedStatus.map((bookedStatus) => {
                            let label = bookedStatus;

                            if (bookedStatus === "NOT_BOOKED") {
                              label = "Not Booked";
                            } else if (bookedStatus === "BOOKED") {
                              label = "Booked";
                            } else if (bookedStatus === "CANCELLED") {
                              label = "Cancelled";
                            }

                            return (
                              <Option key={bookedStatus} value={bookedStatus}>
                                {label}
                              </Option>
                            );
                          })}
                        </Select>
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
                  <Form.Item
                    label="Thumbnail"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Image
                      src={tour?.thumbnail}
                      width={"100%"}
                      height={"300px"}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />

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
                        marginTop: "10px",
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
                          id="imageInput"
                          type="file"
                          onChange={(e) => {
                            setSelectedImage(e.target.files[0]);
                            field.onChange(e.target.files[0]);
                            setErrorChangeImage(false);
                          }}
                          style={{
                            marginBottom: "10px",
                          }}
                        />
                      )}
                    />
                  )}

                  <Controller
                    name="datTime"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item label="Date Time">
                        <RangePicker
                          disabledDate={disabledDate}
                          onChange={handleRangePickerChange}
                          value={dates}
                        />
                        <br />
                        {
                          <Text
                            style={{
                              color: "red",
                            }}
                          >
                            {errorDatePicker}
                          </Text>
                        }
                      </Form.Item>
                    )}
                  />

                  <Form.Item label="Schedules">
                    <Timeline
                      mode="left"
                      style={{
                        marginTop: "5px",
                      }}
                    >
                      {weekdays.length > 0 &&
                        weekdays.map((day, index) => (
                          <Timeline.Item
                            key={index}
                            label={`${day.dayOfWeek} - ${day.date} `}
                          >
                            <Row
                              style={{
                                width: "100%",
                              }}
                            >
                              <Col span={24}>
                                <Input
                                  defaultValue={day.activities}
                                  onChange={(e) =>
                                    handleActivitiesChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter activities"
                                />
                              </Col>
                            </Row>
                          </Timeline.Item>
                        ))}
                    </Timeline>
                    {weekdays.length === 0 && (
                      <Text style={{ fontSize: "14px", fontWeight: 400 }}>
                        This tour has no schedules
                      </Text>
                    )}
                  </Form.Item>

                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{
                        background: "var(--pink)",
                        color: "var(--white)",
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
          <Col
            span={24}
            style={{
              borderTop: "1px solid var(--border)",
              padding: "20px 0",
            }}
          >
            <CustomText
              size={"18px"}
              weight={"500"}
              color={"var(--black-text)"}
              isButton={true}
            >
              Book Hotels For The Tour
            </CustomText>
          </Col>
          <Row
            gutter={0}
            style={{
              width: "100%",
            }}
            justify={"space-between"}
          >
            <Col span={12}>
              <Form layout="vertical">
                <Form.Item label="Hotels list">
                  <Select
                    showSearch
                    style={{
                      width: "90%",
                    }}
                    placeholder="Search to hotels"
                    optionFilterProp="name"
                    filterSort={(optionA, optionB) =>
                      (optionA?.name ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.name ?? "").toLowerCase())
                    }
                    options={optionsHotels}
                    tokenSeparators={[","]}
                    mode="multiple"
                    onChange={handleChangeSelectHotels}
                    virtual={false}
                  />
                </Form.Item>

                <Form.Item label="Selected Hotels">
                  {selectedHotels.map((hotelId) => {
                    const selectedHotel = hotels.find(
                      (hotel) => hotel.id === hotelId
                    );
                    if (!selectedHotel) return null;
                    return (
                      <Button
                        key={selectedHotel.id}
                        style={{ marginTop: "8px", marginRight: "8px" }}
                        onClick={() => handleTagClick(selectedHotel.id)}
                      >
                        <img
                          src={selectedHotel.thumbnailUrls[0]}
                          alt={selectedHotel.name}
                          style={{ width: 20, height: 20, marginRight: 5 }}
                        />
                        {selectedHotel.name}
                      </Button>
                    );
                  })}
                </Form.Item>
              </Form>
            </Col>
            <Col span={12}>
              {hasRooms ? (
                <Row
                  gutter={16}
                  style={{
                    width: "100%",
                    paddingTop: "20px",
                  }}
                  justify={"space-between"}
                >
                  {selectedHotelRooms.map((room) => (
                    <Col span={12}>
                      <Card
                        hoverable
                        bordered={false}
                        style={{
                          border: "1px solid var(--bg-admin)",
                        }}
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
                            borderBottom: "1px solid var(--border)",
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
                            marginBottom: "20px",
                          }}
                        >
                          <Tag color="var(--pink)">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(room?.price - room?.discount)}{" "}
                            / hour
                          </Tag>
                        </Col>

                        {/* <Row
                                justify={"center"}
                                style={{
                                  width: "100%",
                                  marginTop: "20px",
                                }}
                              >
                                <Col>
                                  <Tag
                                    color={
                                      getTagProps(room?.bookedStatus)?.color ||
                                      "default"
                                    }
                                  >
                                    {getTagProps(room?.bookedStatus)?.tagText ||
                                      "Unknown"}
                                  </Tag>
                                </Col>
                              </Row>

                              <Row
                                justify={"center"}
                                style={{
                                  width: "100%",
                                  marginTop: "20px",
                                }}
                              >
                                <Col>
                                  <Tag
                                    color={
                                      getTagProps(room?.activeStatus)?.color ||
                                      "default"
                                    }
                                  >
                                    {getTagProps(room?.activeStatus)?.tagText ||
                                      "Unknown"}
                                  </Tag>
                                </Col>
                              </Row> */}

                        {/* <Row>
                          <Col>
                            <RangePicker
                              showTime={{
                                defaultValue: dayjs("00:00", "HH:mm"),
                                format: "HH",
                              }}
                              disabledDate={disabledDate}
                              // disabledTime={(current) =>
                              //   disabledTime([
                              //     {
                              //       date: "2024-06-28",
                              //       times: [
                              //         { startHour: 7, endHour: 9 },
                              //         { startHour: 12, endHour: 14 },
                              //       ],
                              //     },
                              //     {
                              //       date: "2024-06-29",
                              //       times: [
                              //         { startHour: 1, endHour: 3 },
                              //         { startHour: 5, endHour: 7 },
                              //       ],
                              //     },
                              //   ])(current)
                              // }

                              disabledTime={disabledTime(
                                room?.tourRoomBookings
                              )}
                              onChange={(dates, dateStrings) =>
                                onChangeDatePicker(
                                  dates,
                                  dateStrings,
                                  room?.id,
                                  room?.price
                                )
                              }
                            />
                          </Col>
                        </Row> */}

                        <Row
                          justify={"center"}
                          style={{
                            width: "100%",
                            marginTop: "20px",
                          }}
                        >
                          {/* <Col>
                              <Link to={`/courses/${1}`}>
                                <Button>Update</Button>
                              </Link>
                            </Col> */}

                          <Col>
                            <Button
                              // style={{
                              //   background: "var(--green-dark)",
                              //   color: "var(--white)",
                              // }}
                              onClick={() => showModalTourRoomBooking(room?.id)}
                            >
                              Detail
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No rooms available for this hotel.</p>
              )}
            </Col>
          </Row>
        </Row>
      )}

      <Modal
        title="Info room in hotel"
        footer={null}
        open={isModalTourRoomBooking}
        onOk={handleOkTourRoomBooking}
        onCancel={handleCancelTourRoomBooking}
        width={1000}
        centered
      >
        <Form
          onFinish={handleSubmit(onSubmitTourRoomBooking)}
          layout="vertical"
        >
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

              <Form.Item label="Price / hour">
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

              <Form.Item label="Type">
                <Input value={selectedRoom?.type} readOnly />
              </Form.Item>

              <Form.Item label="Active Status">
                <Input value={selectedRoom?.activeStatus} readOnly />
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
                    <Col span={12} key={index} style={{ marginBottom: "10px" }}>
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

              <Form.Item label="Times">
                <RangePicker
                  showTime={{
                    defaultValue: dayjs("00:00", "HH:mm"),
                    format: "HH",
                  }}
                  disabledDate={disabledDate}
                  disabledTime={disabledTime(selectedRoom?.tourRoomBookings)}
                  onChange={(dates, dateStrings) =>
                    onChangeDatePicker(
                      dates,
                      dateStrings,
                      selectedRoom?.id,
                      selectedRoom?.price
                    )
                  }
                />
              </Form.Item>

              {totalPriceRoom && (
                <Form.Item label="Total Price">
                  <InputNumber
                    value={totalPriceRoom}
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
                    // background: "var(--pink)",
                    // color: "var(--white)",
                    marginTop: "20px",
                    width: "100%",
                  }}
                  icon={loadingButtonTourRoomBooking ? <Spin /> : null}
                  loading={loadingButtonTourRoomBooking}
                  onClick={handleTourRoomBooking}
                  disabled
                  type="default"
                >
                  Booking Now (Updating)
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateTour;
