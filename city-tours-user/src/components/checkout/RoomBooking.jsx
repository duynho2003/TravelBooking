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
  Form,
  Collapse,
  Image,
  InputNumber,
} from "antd";
import category1 from "../../assets/images/category-1.jpg";
import category2 from "../../assets/images/category-2.jpg";
import category3 from "../../assets/images/category-3.png";
import CustomText from "../common/CustomText";
import { Link, useLocation, useParams } from "react-router-dom";
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
import { Radio, Space } from "antd";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { getTourById } from "../../features/tour/TourSlice";
import { useEffect, useState } from "react";
import logoVNPay from "../../assets/images/logo-vnpay.webp";
import logoMomo from "../../assets/images/logo-momo.png";
import logoZalopay from "../../assets/images/logo-zalopay.webp";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";

dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function RoomBooking({ tour }) {
  const roomBookingData = useSelector((state) => state.hotels?.roomBooking);
  const userId = useSelector((state) => state.auth?.info?.id);
  const isCustomer = useSelector((state) => state.customer?.info?.customer);
  const customerName = useSelector(
    (state) => state.customer?.info?.customer?.name
  );
  const phone = useSelector((state) => state.customer?.info?.customer?.phone);
  const address = useSelector(
    (state) => state.customer?.info?.customer?.address
  );

  const [value, setValue] = useState(1);
  const [quantityAdults, setQuantityAdults] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [quantityBaby, setQuantityBaby] = useState(0);
  const [yourDetails, setYourDetails] = useState({
    userId: userId,
    name: "",
    phone: "",
    address: "",
  });

  // Ant Design
  const screens = useBreakpoint();

  const { control, handleSubmit } = useForm({});

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const onChangeAdults = (value) => {
    console.log("change adults", value);
    setQuantityAdults(value);
  };

  const onChangeChildren = (value) => {
    console.log("change adults", value);
    setQuantityChildren(value);
  };

  const onChangeBaby = (value) => {
    console.log("change adults", value);
    setQuantityBaby(value);
  };

  // Handle event
  const handleAddCustomer = async () => {
    const token = Cookies.get("token");

    const urlAddCustomer = "http://localhost:5050/api/v1/customers";
    try {
      await axios.post(urlAddCustomer, yourDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      throw error; // Re-throw để bắt lỗi ở handleCheckout
    }
  };

  const handleAddRoomBooking = async () => {
    const token = Cookies.get("token");

    const urlAddRoomBooking =
      "http://localhost:5050/api/v1/roomBookings/create";

    const dataBooking = {
      userId: userId,
      roomId: roomBookingData?.roomId,
      date: roomBookingData?.date,
      startDate: roomBookingData?.startDate,
      endDate: roomBookingData?.endDate,
      price: roomBookingData?.totalAmount,
      roomType: roomBookingData?.roomType,
      roomNumber: roomBookingData?.roomNumber,
      bookingStatus: "SUCCESS",
      paymentStatus: "SUCCESS",
      hotelName: roomBookingData?.hotelName,
    };

    try {
      const response = await axios.post(urlAddRoomBooking, dataBooking, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookingId = response.data.data.id;
      return bookingId;
    } catch (error) {
      console.error("Error adding tour booking:", error);
      throw error;
    }
  };

  const handleCreateOrder = async (bookingId) => {
    const amount = roomBookingData?.totalAmount;

    const orderInfo = `BOOKING ROOM ${bookingId}`;
    const urlVNPay = `http://localhost:5050/api/v1/payments/createOrder?amount=${amount}&orderInfo=${orderInfo}`;

    try {
      const response = await axios.post(urlVNPay);
      const redirectUrl = response.data;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error; // Re-throw để bắt lỗi ở handleCheckout
    }
  };

  const handleCheckout = async () => {
    try {
      if (isCustomer === null) {
        await handleAddCustomer();
      }
      const bookingId = await handleAddRoomBooking();
      await handleCreateOrder(bookingId);
    } catch (error) {
      console.error("Error during checkout process:", error);
      // Xử lý lỗi tại đây nếu cần thiết
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
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
                      Checkout
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
                      {tour?.name}
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
          gutter={20}
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px 0",
          }}
        >
          {/* Col content */}
          <Col span={16}>
            {/* Your details */}
            <Row
              style={{
                width: "100%",
                marginBottom: "16px",
              }}
            >
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Col span={24}>
                  <Row
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col
                      style={{
                        background: "var(--pink)",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText
                        size={"16px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        1
                      </CustomText>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "0 15px",
                      }}
                    >
                      <CustomText
                        size={"22px"}
                        weight={"500"}
                        color={"var(--gray-text)"}
                      >
                        Your Details
                      </CustomText>

                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row
                style={{
                  width: "100%",
                  padding: "0 20px",
                }}
              >
                <Form
                  layout="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <Row
                    style={{
                      width: "100%",
                      borderLeft: "2px solid var(--border)",
                      padding: "20px 34px",
                    }}
                    justify={"space-between"}
                  >
                    <Col span={11}>
                      <Form.Item label="Name" required>
                        {customerName ? (
                          <Input value={customerName} />
                        ) : (
                          <Input
                            placeholder="Enter your name"
                            onChange={(e) =>
                              setYourDetails({
                                ...yourDetails,
                                name: e.target.value,
                              })
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={11}>
                      <Form.Item label="Phone" required>
                        {phone ? (
                          <Input value={phone} />
                        ) : (
                          <Input
                            placeholder="Enter your phone"
                            type="number"
                            onChange={(e) =>
                              setYourDetails({
                                ...yourDetails,
                                phone: e.target.value,
                              })
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>

                    <Col span={11}>
                      <Form.Item label="Address" required>
                        {address ? (
                          <Input value={address} />
                        ) : (
                          <Input
                            placeholder="Enter your address"
                            onChange={(e) =>
                              setYourDetails({
                                ...yourDetails,
                                address: e.target.value,
                              })
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Row>

            {/* Payment informations */}
            <Row
              style={{
                width: "100%",
                marginBottom: "16px",
              }}
            >
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Col span={24}>
                  <Row
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col
                      style={{
                        background: "var(--pink)",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText
                        size={"16px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        2
                      </CustomText>
                    </Col>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "0 15px",
                      }}
                    >
                      <CustomText
                        size={"22px"}
                        weight={"500"}
                        color={"var(--gray-text)"}
                      >
                        Payment Informations
                      </CustomText>

                      <CustomText
                        size={"13px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        Mussum ipsum cacilds, vidis litro abertis
                      </CustomText>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row
                style={{
                  width: "100%",
                  padding: "0 20px",
                }}
              >
                <Form
                  layout="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <Row
                    style={{
                      width: "100%",
                      borderLeft: "2px solid var(--border)",
                      padding: "20px 34px",
                    }}
                    justify={"space-between"}
                  >
                    <Col span={12}>
                      <Form.Item label="Select payment method">
                        <Radio.Group onChange={onChange} value={value}>
                          <Space direction="vertical">
                            <Radio
                              value={1}
                              style={{
                                width: "100%",
                              }}
                            >
                              <Col
                                style={{
                                  border: "1px solid red",
                                  width: "300px",
                                  height: "50px",
                                  borderRadius: "3px",
                                  background: "var(--white)",
                                  border: "1px solid var(--border)",
                                  padding: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  size={"13px"}
                                  weight={"400"}
                                  color={"var(--gray-text)"}
                                >
                                  VNPay
                                </CustomText>

                                <Image
                                  src={logoVNPay}
                                  preview={false}
                                  style={{
                                    width: "100%",
                                    height: "30px",
                                  }}
                                />
                              </Col>
                            </Radio>
                            <Radio value={2} disabled>
                              <Col
                                style={{
                                  border: "1px solid red",
                                  width: "300px",
                                  height: "50px",
                                  borderRadius: "3px",
                                  background: "var(--white)",
                                  border: "1px solid var(--border)",
                                  padding: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  size={"13px"}
                                  weight={"400"}
                                  color={"var(--gray-text)"}
                                >
                                  Momo (Updating)
                                </CustomText>

                                <Image
                                  src={logoMomo}
                                  preview={false}
                                  style={{
                                    width: "100%",
                                    height: "30px",
                                  }}
                                />
                              </Col>
                            </Radio>
                            <Radio value={3} disabled>
                              <Col
                                style={{
                                  border: "1px solid red",
                                  width: "300px",
                                  height: "50px",
                                  borderRadius: "3px",
                                  background: "var(--white)",
                                  border: "1px solid var(--border)",
                                  padding: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  size={"13px"}
                                  weight={"400"}
                                  color={"var(--gray-text)"}
                                >
                                  ZaloPay (Updating)
                                </CustomText>

                                <Image
                                  src={logoZalopay}
                                  preview={false}
                                  style={{
                                    width: "100%",
                                    height: "30px",
                                  }}
                                />
                              </Col>
                            </Radio>

                            <Radio value={4} disabled>
                              <Col
                                style={{
                                  border: "1px solid red",
                                  width: "300px",
                                  height: "50px",
                                  borderRadius: "3px",
                                  background: "var(--white)",
                                  border: "1px solid var(--border)",
                                  padding: "20px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  size={"13px"}
                                  weight={"400"}
                                  color={"var(--gray-text)"}
                                >
                                  Pay later (Updating)
                                </CustomText>
                              </Col>
                            </Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Row>
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
                  - Booking -
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
                {/* Checkin */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
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
                      Checkin
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
                      {formatDate(roomBookingData?.startDate)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Checkout */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
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
                      Checkout
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
                      {formatDate(roomBookingData?.endDate)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Room Type */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
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
                      Room Type
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
                      {roomBookingData?.roomType}
                    </CustomText>
                  </Col>
                </Row>

                {/* Room Number */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
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
                      Room Number
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
                      {roomBookingData?.roomNumber}
                    </CustomText>
                  </Col>
                </Row>

                {/* Discount */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
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
                      }).format(roomBookingData?.discount)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Origin price */}
                {/* <Row
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
                      Origin price / hour
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
                        roomBookingData?.price + roomBookingData?.discount
                      )}
                    </CustomText>
                  </Col>
                </Row> */}

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
                      Total price / hour
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
                      }).format(roomBookingData?.price)}
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
                      }).format(roomBookingData?.totalAmount)}
                    </CustomText>
                  </Col>
                </Row>

                <Button
                  size="large"
                  className="hover-button"
                  style={{
                    width: "100%",
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                  onClick={handleCheckout}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                    isUppercase={true}
                  >
                    Checkout
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
