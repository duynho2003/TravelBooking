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
import { Link, useNavigate, useParams } from "react-router-dom";
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

const ViewRoom = () => {
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
  const { control, handleSubmit, reset } = useForm();

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
        type: selectedRoom?.type,
        numberOfResidents: selectedRoom?.numberOfResidents,
        basePrice: selectedRoom?.basePrice,
        weekendPrice: selectedRoom?.weekendPrice,
        discount: selectedRoom?.discount,
        activeStatus: selectedRoom?.activeStatus,
      });

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
    }
  }, [selectedRoom]);

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

  console.log("holidaysData: ", holidaysData);

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
                      View room {selectedRoom?.roomNumber} in hotel {}
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
              <Link to={`/admin/hotels/${hotelId}/room/${roomId}/update`}>
                <CustomText
                  size={"14px"}
                  weight={"500"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Update Room
                </CustomText>
              </Link>
            </Button>
          </Col>
          <Col xl={24}>
            <Form
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
                  <Form.Item label="Room Number">
                    <Input value={selectedRoom?.roomNumber} readOnly />
                  </Form.Item>

                  <Form.Item label="Type">
                    <Input value={selectedRoom?.type} readOnly />
                  </Form.Item>

                  <Form.Item
                    label="Number Of Residents"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input value={selectedRoom?.numberOfResidents} readOnly />
                  </Form.Item>

                  <Form.Item label="Active Status">
                    <Input value={selectedRoom?.activeStatus} readOnly />
                  </Form.Item>

                  <Form.Item label="Images">
                    <Row
                      gutter={8}
                      style={{
                        width: "100%",
                      }}
                    >
                      {selectedRoom?.imageUrls?.map((url, index) => (
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
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form.Item label="Base price / per hour">
                    <InputNumber
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
                      value={selectedRoom?.basePrice}
                    />
                  </Form.Item>

                  <Form.Item label="Weekend price / per hour">
                    <InputNumber
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
                      value={selectedRoom?.weekendPrice}
                    />
                  </Form.Item>

                  <Form.Item label="Holidays">
                    <DatePicker
                      value={defaultValuesDatePicker}
                      multiple
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
                      value={selectedRoom?.discount}
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

export default ViewRoom;
