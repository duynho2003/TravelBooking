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
  Table,
  Collapse,
  TimePicker,
  Typography,
  Image,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import { getTourById } from "../../features/tour/TourSlice";
import { bookedStatus } from "../../utils/enums/BookedStatus";
import { activeStatus } from "../../utils/enums/ActiveStatus";
import dayjs from "dayjs";
import "dayjs/locale/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useParams } from "react-router-dom";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const UpdateTour = () => {
  // Redux State
  const { tourId } = useParams();
  const dispatch = useDispatch();
  const tour = useSelector((state) => state.tours?.selectedTour);
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

  console.log("schedules: ", schedules);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getTourById(tourId));

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
        address: tour?.address,
        price: tour?.price,
        bookedStatus: tour?.bookedStatus,
        activeStatus: tour?.activeStatus,
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
      address: data.address,
      price: parseInt(data.price),
      bookedStatus: data.bookedStatus,
      activeStatus: data.activeStatus,
      thumbnail: thumbnailToUse,
      schedules: weekdays,
    };

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

  console.log(dataSource);

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
                    name="price"
                    control={control}
                    rules={{ required: "Price is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Price"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        {/* <Input {...field} /> */}

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

                  {/* Render danh sách các ngày */}
                  {/* {weekdays.length > 0 && (
                    <Form.Item label="Schedules">
                      {weekdays.map((day, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "20px",
                            borderBottom: "1px solid var(--green-dark)",
                          }}
                        >
                          <CustomText
                            size={"14px"}
                            weight={"500"}
                            color={"var(--green-dark)"}
                            isButton={true}
                          >
                            {day}
                          </CustomText>
                          <Table
                            dataSource={
                              dataSource.find((data) => data.key === day)
                                ?.data || []
                            }
                            columns={columns}
                            pagination={false}
                          />
                          <Button
                            type="primary"
                            onClick={() => handleAddRow(index)}
                            style={{
                              margin: "10px 0",
                              background: "var(--green-dark)",
                            }}
                          >
                            Add Row
                          </Button>
                        </div>
                      ))}
                    </Form.Item>
                  )} */}

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

export default UpdateTour;
