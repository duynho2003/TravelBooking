import {
  Col,
  Row,
  Grid,
  Breadcrumb,
  Button,
  Rate,
  Slider,
  Radio,
  Space,
  Image,
  Pagination,
  Tag,
} from "antd";
import CustomText from "../common/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faVolumeHigh,
  faFilter,
  faBlenderPhone,
  faMap,
  faTruckPlane,
  faUser,
  faChild,
  faPersonBreastfeeding,
  faWifi,
  faDumbbell,
  faUtensils,
  faHotel,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import badgeSave from "../../assets/images/badge_save.png";
dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function Content({
  roomBookings,
  totalPages,
  currentPage,
  pagination,
  handleTableChange,
}) {
  // Local State
  const [valueRadio, setValueRadio] = useState(
    pagination.review === "" ? "" : parseInt(pagination.review)
  );

  // Ant Design
  const screens = useBreakpoint();

  const marks = {
    0: "0",
    1000000: "1tr",
    2000000: "2tr",
    3000000: "3tr",
    4000000: "4tr",
    5000000: "5tr",
  };

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  // Event Handlers
  // const onChangeSlider = (value) => {
  //   // console.log("Value change slider: ", value);
  //   // const minPrice = value?.[0];
  //   // const maxPrice = value?.[1];
  //   const review = pagination.review;
  //   handleTableChange(1, pagination.limit, review);
  // };

  const onChangePanigation = (page) => {
    handleTableChange(page, pagination.limit);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    return date.toLocaleDateString("en-US", options).toUpperCase();
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
                      Room Bookings List
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
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px 0",
          }}
        >
          {/* Col tours list */}
          <Col
            span={24}
            style={{
              marginBottom: "20px",
            }}
          >
            {roomBookings && roomBookings.length > 0 ? (
              roomBookings.map((roomBooking) => (
                <Row
                  key={roomBooking?.id}
                  style={{
                    width: "100%",
                    height: "140px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Date */}
                  <Col
                    span={7}
                    style={{
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Col
                      style={{
                        height: "40px",
                        background: "var(--pink)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText
                        size={"18px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        {(() => {
                          const date = new Date();
                          const monthOptions = { month: "long" };
                          const monthName = date
                            .toLocaleDateString("en-US", monthOptions)
                            .toUpperCase();

                          return monthName;
                        })()}
                      </CustomText>
                    </Col>

                    <Col
                      style={{
                        height: "100%",
                        background: "var(--white)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText
                        size={"40px"}
                        weight={"400"}
                        color={"var(--pink)"}
                      >
                        {formatDate(roomBooking?.startDate)}
                      </CustomText>

                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--black-text)"}
                      >
                        {getDayName(roomBooking?.startDate)}
                      </CustomText>
                    </Col>
                  </Col>

                  {/* Content */}
                  <Col
                    span={12}
                    style={{
                      padding: "20px",
                      background: "var(--white)",
                      borderTop: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <Row
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Col
                        span={12}
                        style={{
                          height: "100%",
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <Col
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "10px",
                            width: "50px",
                            height: "50px",
                            border: "2px solid var(--border)",
                            borderRadius: "50%",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faHotel}
                            style={{
                              fontSize: "22px",
                              color: "var(--pink)",
                            }}
                          />
                        </Col>

                        <Col>
                          {/* Hotel Name */}
                          <Col
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              marginBottom: "10px",
                            }}
                          >
                            <CustomText
                              size={"16px"}
                              weight={"600"}
                              color={"var(--gray-text)"}
                              isUppercase={true}
                            >
                              {roomBooking.hotelName}
                            </CustomText>
                          </Col>

                          {/* Number rooms */}
                          <Col
                            style={{
                              marginBottom: "10px",
                            }}
                          >
                            <CustomText
                              size={"13px"}
                              weight={"400"}
                              color={"var(--gray-text)"}
                            >
                              Number rooms:
                            </CustomText>{" "}
                            <Tag color="var(--green-dark)">
                              <CustomText
                                size={"12px"}
                                weight={"400"}
                                color={"var(--white)"}
                              >
                                {roomBooking?.roomNumber}
                              </CustomText>
                            </Tag>
                          </Col>

                          {/* Type rooms */}
                          <Col
                            style={{
                              marginBottom: "10px",
                            }}
                          >
                            <CustomText
                              size={"13px"}
                              weight={"400"}
                              color={"var(--gray-text)"}
                            >
                              Type rooms:
                            </CustomText>{" "}
                            <Tag color="var(--green-dark)">
                              <CustomText
                                size={"12px"}
                                weight={"400"}
                                color={"var(--white)"}
                              >
                                {roomBooking?.roomType}
                              </CustomText>
                            </Tag>
                          </Col>
                        </Col>
                      </Col>

                      <Col
                        span={12}
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        {/* Checkin */}
                        <Col
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            marginBottom: "10px",
                            textAlign: "right",
                          }}
                        >
                          <CustomText
                            size={"12px"}
                            weight={"600"}
                            color={"var(--gray-text)"}
                            isUppercase={true}
                          >
                            Checkin
                          </CustomText>
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--gray-text)"}
                          >
                            {formatDate(roomBooking?.startDate)}
                          </CustomText>
                        </Col>

                        {/* Checkout */}
                        <Col
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "end",
                            marginBottom: "10px",
                            textAlign: "right",
                          }}
                        >
                          <CustomText
                            size={"12px"}
                            weight={"600"}
                            color={"var(--gray-text)"}
                            isUppercase={true}
                          >
                            Checkout
                          </CustomText>

                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--gray-text)"}
                          >
                            {formatDate(roomBooking?.endDate)}
                          </CustomText>
                        </Col>
                      </Col>
                    </Row>
                  </Col>

                  {/* Details */}
                  <Col
                    span={5}
                    style={{
                      background: "var(--white)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <CustomText
                      size={"24px"}
                      weight={"400"}
                      color={"var(--pink)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(roomBooking?.price)}
                    </CustomText>
                  </Col>
                </Row>
              ))
            ) : (
              <Row
                style={{
                  width: "100%",
                  height: "200px",
                  padding: "10px 0",
                }}
                justify={"center"}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                >
                  No room bookings found
                </CustomText>
              </Row>
            )}
          </Col>

          {roomBookings && roomBookings.length > 0 && (
            <Col
              span={24}
              style={{
                padding: "10px 0",
                textAlign: "center",
              }}
            >
              <Pagination
                pageSize={pagination.limit}
                current={currentPage}
                total={totalPages}
                onChange={onChangePanigation}
              />
            </Col>
          )}
        </Row>
      </Row>
    </>
  );
}
