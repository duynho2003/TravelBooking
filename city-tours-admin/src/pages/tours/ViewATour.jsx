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
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getTourById } from "../../features/tour/TourSlice";
import "../../App.css";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const ViewATour = () => {
  // Redux State
  const { tourId } = useParams();
  const dispatch = useDispatch();
  const tour = useSelector((state) => state.tours?.selectedTour);
  const isLoading = useSelector((state) => state.tours?.isLoading);
  const error = useSelector((state) => state.tours?.error);

  // Local State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [weekdays, setWeekdays] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [schedules, setSchedules] = useState({
    startDay: startDate,
    endDay: endDate,
    weeks: [],
  });
  const [dates, setDates] = useState([]);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getTourById(tourId));
  }, [dispatch]);

  useEffect(() => {
    if (tour) {
      const startDate = dayjs(tour?.schedules[0]?.date, "YYYY-MM-DD");

      const endDate = dayjs(
        tour?.schedules[tour?.schedules?.length - 1]?.date,
        "YYYY-MM-DD"
      );

      setDates([startDate, endDate]);

      console.log("dates: ", dates);

      const weekdays = tour?.schedules;
      setWeekdays(weekdays);

      if (!isLoading) {
        setTimeout(() => {
          setShowContent(true);
        }, 1000);
      }
    }
  }, [tour]);

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

  const columns = [
    {
      title: "Start hour",
      dataIndex: "startHour",
      key: "startHour",
      render: (_, record, dataIndex) => (
        <TimePicker
          defaultValue={dayjs(record.startHour, "HH:mm:ss")}
          disabled
        />
      ),
    },
    {
      title: "End hour",
      dataIndex: "endHour",
      key: "endHour",
      render: (_, record, dataIndex) => (
        <TimePicker defaultValue={dayjs(record.endHour, "HH:mm:ss")} disabled />
      ),
    },
    {
      title: "Activities",
      dataIndex: "activities",
      key: "activities",
      render: (_, record, dataIndex) => (
        <Input value={record.activities} readOnly />
      ),
    },
  ];

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
                      View A Tour - {tour?.name}
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
              <Link to={`/admin/tours/update/${tourId}`}>
                <CustomText
                  size={"14px"}
                  weight={"500"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Update Tour
                </CustomText>
              </Link>
            </Button>
          </Col>
          <Col xl={24}>
            <Form layout="vertical">
              <Row
                style={{
                  width: "100%",
                }}
                justify={"space-between"}
              >
                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="Name">
                    <Input value={tour?.name} readOnly />
                  </Form.Item>

                  <Form.Item label="Description">
                    <Input value={tour?.description} readOnly />
                  </Form.Item>

                  <Form.Item label="Address">
                    <Input value={tour?.address} readOnly />
                  </Form.Item>

                  <Form.Item label="Price">
                    <Input
                      value={new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.price)}
                      readOnly
                    />
                  </Form.Item>

                  {/* <Form.Item label="Created At">
                    <Input
                      value={new Date(tour?.createdAt).toLocaleString()}
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item label="Updated At">
                    <Input
                      value={new Date(tour?.updatedAt).toLocaleString()}
                      readOnly
                    />
                  </Form.Item> */}

                  <Form.Item label="Booked Status">
                    <Tag
                      color={
                        getTagProps(tour?.bookedStatus)?.color || "default"
                      }
                    >
                      {getTagProps(tour?.bookedStatus)?.tagText || "Unknown"}
                    </Tag>
                  </Form.Item>

                  <Form.Item label="Active Status">
                    <Tag
                      color={
                        getTagProps(tour?.activeStatus)?.color || "default"
                      }
                    >
                      {getTagProps(tour?.activeStatus)?.tagText || "Unknown"}
                    </Tag>
                  </Form.Item>
                </Col>

                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item label="Thumbnail">
                    <Image
                      src={tour?.thumbnail}
                      width={"100%"}
                      height={"300px"}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        objectFit: "cover",
                      }}
                    />
                  </Form.Item>

                  <Form.Item label="Date Time">
                    <RangePicker value={dates} disabled />
                  </Form.Item>

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
                        </div>
                      ))}
                    </Form.Item>
                  )} */}
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ViewATour;
