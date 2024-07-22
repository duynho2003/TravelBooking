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
import { getAllHotels } from "../../features/hotel/HotelSlice";
dayjs.extend(customParseFormat);
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import goongApi from "../../services/goongJs/goongApi";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CreateTour = () => {
  // Constants
  const INIT_PAGE = 1;
  const INIT_LIMIT = 6;

  // Redux State
  const dispatch = useDispatch();
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

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    // dispatch(
    //   getAllHotels({
    //     page: INIT_PAGE,
    //     limit: INIT_LIMIT,
    //   })
    // );

    // Delay showing content after loading
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
      await handleAddCoordinates();

      const thumbnail = await uploadImage();

      const newData = {
        code: generateTourCode(),
        name: data.name,
        description: data.description,
        detail: data.detail,
        priceAdult: parseInt(data.priceAdult),
        priceChild: parseInt(data.priceChild),
        priceBaby: parseInt(data.priceBaby) || 0.0,
        discount: parseInt(data.discount) || 0.0,
        depart: data.depart,
        startTime: "startHour",
        adults: data.adults,
        children: data.children,
        baby: data.baby,
        thumbnail: thumbnail,
        tourTimes: timeSlot,
        tourLocations: locations,
      };

      console.log("newData: ", newData);

      const token = Cookies.get("token");

      await axios.post(`http://localhost:5050/api/v1/tours/create`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      reset();
      resetFileInput();
      setDataSource([]);
      setWeekdays([]);
      handleResetPicker();
      setIsOpenTimeSlot(false);
      setTimeSlot([]);
      setIsOpenLocations(false);
      setLocations([]);

      notification.success({
        message: "Tour created successfully",
        description: "Tour created successfully.",
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

    setStartTime(dateStrings?.[0]);

    setStartDate(dateStrings?.[0]);
    setEndDate(dateStrings?.[1]);

    setDates(dates);

    console.log("Lịch trình 1: ", dateStrings?.[0], " ", dateStrings?.[1]);

    const weekdays = getWeekdaysInRange(dateStrings[0], dateStrings[1]);
    setWeekdays(weekdays);
    console.log("Weekdays:", weekdays);
  };

  const handleAddRow = (dayIndex) => {
    const newData = {
      key: `${weekdays[dayIndex]}-${count + 1}`,
      startHour: (
        <TimePicker defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")} />
      ),
      endHour: <TimePicker defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")} />,
      activities: <Input placeholder="Enter activities" />,
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

    console.log("schedules: ", schedules);

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
          defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
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
          defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
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
        />
      ),
    },
  ];

  const handleActivitiesChange = (index, value) => {
    // Sao chép mảng weekdays để không làm thay đổi trực tiếp state
    const updatedWeekdays = [...weekdays];

    // Cập nhật giá trị activities tương ứng
    updatedWeekdays[index].activities = value;

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

  const onChangeDatePicker = (dates, dateStrings, roomId, pricePerHour) => {
    if (dateStrings && dateStrings.length === 2) {
      const startHour = dateStrings[0].split(" ")[1];
      const endHour = dateStrings[1].split(" ")[1];

      const startTime = dayjs(dateStrings[0]);
      const endTime = dayjs(dateStrings[1]);
      const durationHours = endTime.diff(startTime, "hours");

      const price = durationHours * pricePerHour;

      // Find hotelId based on roomId
      let hotelId = null;
      hotels.forEach((hotel) => {
        const room = hotel.rooms.find((r) => r.id === roomId);

        if (room) {
          hotelId = hotel.id;
        }
      });

      if (hotelId) {
        const newRoom = {
          roomId: roomId,
          hotelId: hotelId,
          date: dates[0].format("YYYY-MM-DD"),
          startHour: startHour,
          endHour: endHour,
          price: price,
        };

        console.log("Updated newdata with new room:", newRoom);
        // You can update state or perform other operations with newRoom here
      } else {
        console.log(`Hotel not found for roomId: ${roomId}`);
      }
    }
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };

  const disabledTime = (disabledTimes) => {
    return (current) => {
      const currentDate = current.format("YYYY-MM-DD");
      const currentDisabledTimes = disabledTimes.find(
        (item) => item.date === currentDate
      );

      if (currentDisabledTimes) {
        const { times } = currentDisabledTimes;
        const disabledHours = [];

        times.forEach(({ startHour, endHour }) => {
          for (let hour = startHour; hour <= endHour; hour++) {
            disabledHours.push(hour);
          }
        });

        return {
          disabledHours: () => disabledHours,
        };
      }

      return {};
    };
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

  const [isOpenTimeSlot, setIsOpenTimeSlot] = useState(true);
  const [timeSlot, setTimeSlot] = useState([]);
  const [isOpenLocations, setIsOpenLocations] = useState(true);
  const [locations, setLocations] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);

  const handleOpenTimeSlot = () => {
    setIsOpenTimeSlot(!isOpenTimeSlot);
  };

  const handleOpenLocations = () => {
    setIsOpenLocations(!isOpenLocations);
  };

  const handleOnChangeRangePicker = (dates, dateStrings) => {
    const formatDate = (dateString) => {
      const [date, time] = dateString.split(" ");
      const [year, month, day] = date.split("-");
      return `${time} - ${day}/${month}/${year}`;
    };

    const startDate = formatDate(dateStrings?.[0]);
    const endDate = formatDate(dateStrings?.[1]);

    setTimeSlot((prev) => [
      ...prev,
      {
        startDate: startDate,
        endDate: endDate,
      },
    ]);

    setIsOpenTimeSlot(false);
  };

  const handleChangeStartPoint = (value) => {
    setStartPoint(value);
  };

  const handleChangeEndPoint = (value) => {
    setEndPoint(value);
  };

  const handleAddLocation = () => {
    if (startPoint && endPoint) {
      setLocations((prev) => [...prev, { startPoint, endPoint }]);
      setStartPoint(null);
      setEndPoint(null);
      setIsOpenLocations(false);
    }
  };

  const handleAddCoordinates = async () => {
    for (const location of locations) {
      try {
        const encodedStartPoint = encodeURIComponent(location.startPoint);
        const encodedEndPoint = encodeURIComponent(location.endPoint);

        const startCoordinates = await goongApi.geocoding(encodedStartPoint);
        const endCoordinates = await goongApi.geocoding(encodedEndPoint);

        if (startCoordinates.length > 0) {
          location.coordinatesStartPoint = JSON.stringify(
            startCoordinates[0].geometry.location
          );
        }

        if (endCoordinates.length > 0) {
          location.coordinatesEndPoint = JSON.stringify(
            endCoordinates[0].geometry.location
          );
        }

        console.log(location);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
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
                      Create Tour
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
                        <Input {...field} placeholder="Enter name" />
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
                    name="detail"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Detail"
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
                          // formats={formats}
                          style={{
                            height: "400px",
                          }}
                        />
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
                        <Input {...field} placeholder="Enter depart" />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="priceAdult"
                    control={control}
                    rules={{
                      required: "Price adult is required",
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
                        label="Price Adult / person"
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
                    name="priceChild"
                    control={control}
                    rules={{
                      required: "Price children is required",
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
                        label="Price Children / person"
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
                    name="priceBaby"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Price Baby / person"
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
                    // rules={{
                    //   required: "Discount is required",
                    //   validate: {
                    //     min: (value) =>
                    //       value >= 100000 || "Minimum price is 100,000 VND",
                    //     max: (value) =>
                    //       value <= 100000000 ||
                    //       "Maximum price is 100,000,000 VND",
                    //   },
                    // }}
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
                              placeholder="5"
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
                              placeholder="0"
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
                              placeholder="0"
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Controller
                    name="logo"
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

                  <Form.Item
                    label={
                      <>
                        Time Slot{" "}
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            cursor: "pointer",
                            marginLeft: "8px",
                            color: "var(--white)",
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            border: "1px solid green",
                            padding: "2px",
                            borderRadius: "50%",
                            background: "var(--green-dark)",
                          }}
                          onClick={handleOpenTimeSlot}
                        />
                      </>
                    }
                  >
                    {isOpenTimeSlot && (
                      <RangePicker
                        showTime
                        onChange={handleOnChangeRangePicker}
                        style={{
                          marginBottom: "10px",
                        }}
                      />
                    )}

                    <List
                      header={<div>List time</div>}
                      bordered
                      dataSource={timeSlot}
                      renderItem={(item, index) => (
                        <List.Item>
                          {index + 1} - From <Tag>{item?.startDate}</Tag> to{" "}
                          <Tag>{item?.endDate}</Tag>
                        </List.Item>
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <>
                        Locations{" "}
                        <FontAwesomeIcon
                          icon={faPlus}
                          style={{
                            cursor: "pointer",
                            marginLeft: "8px",
                            color: "var(--white)",
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            border: "1px solid green",
                            padding: "2px",
                            borderRadius: "50%",
                            background: "var(--green-dark)",
                          }}
                          onClick={handleOpenLocations}
                        />
                      </>
                    }
                  >
                    {isOpenLocations && (
                      <>
                        <Space.Compact
                          size="middle"
                          style={{
                            marginBottom: "15px",
                          }}
                        >
                          <Input
                            onChange={(e) =>
                              handleChangeStartPoint(e.target.value)
                            }
                            placeholder="Enter start point"
                          />
                          <Input
                            onChange={(e) =>
                              handleChangeEndPoint(e.target.value)
                            }
                            placeholder="Enter end point"
                          />
                          <Button onClick={handleAddLocation}>
                            <PlusOutlined />
                          </Button>
                        </Space.Compact>
                      </>
                    )}

                    <List
                      header={<div>List Location</div>}
                      bordered
                      dataSource={locations}
                      renderItem={(item, index) => (
                        <List.Item>
                          Day {index + 1} - From <Tag>{item?.startPoint}</Tag>{" "}
                          to <Tag>{item?.endPoint}</Tag>
                        </List.Item>
                      )}
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
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CreateTour;
