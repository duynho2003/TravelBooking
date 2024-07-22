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
  faPlaneDeparture,
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
  tourBookings,
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
                      Tour Bookings List
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
            {tourBookings && tourBookings.length > 0 ? (
              tourBookings.map((tourBooking) => (
                <Row
                  key={tourBooking?.id}
                  style={{
                    width: "100%",
                    height: "220px",
                    overflow: "hidden",
                    marginBottom: "20px",
                  }}
                >
                  {/* Thumbnail */}
                  <Col
                    span={7}
                    style={{
                      border: "1px solid var(--border)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      src={tourBooking?.thumbnail}
                      preview={false}
                      width={"100%"}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      className="image-hover-zoom"
                    />
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
                        span={24}
                        style={{
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
                            icon={faPlaneDeparture}
                            style={{
                              fontSize: "22px",
                              color: "var(--pink)",
                            }}
                          />
                        </Col>

                        <Col
                          style={{
                            flex: "1",
                          }}
                        >
                          {/* Tour Name */}
                          <Col
                            span={24}
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
                              {tourBooking.tourName}
                            </CustomText>
                          </Col>

                          {/* Tour Code */}
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
                              Tour Code:
                            </CustomText>{" "}
                            <Tag color="var(--green-dark)">
                              <CustomText
                                size={"12px"}
                                weight={"400"}
                                color={"var(--white)"}
                              >
                                {tourBooking?.tourCode}
                              </CustomText>
                            </Tag>
                          </Col>

                          {/* Remaining Seats */}
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
                              Remaining seats:
                            </CustomText>{" "}
                            {tourBooking?.adults && (
                              <Tag color="var(--green-dark)">
                                <CustomText
                                  size={"12px"}
                                  weight={"400"}
                                  color={"var(--white)"}
                                >
                                  <FontAwesomeIcon icon={faUser} /> (
                                  {tourBooking?.adults})
                                </CustomText>
                              </Tag>
                            )}
                            {tourBooking?.children && (
                              <Tag color="var(--green-dark)">
                                <CustomText
                                  size={"12px"}
                                  weight={"400"}
                                  color={"var(--white)"}
                                >
                                  <FontAwesomeIcon icon={faChild} /> (
                                  {tourBooking?.children})
                                </CustomText>
                              </Tag>
                            )}
                            {tourBooking?.babies && (
                              <Tag color="var(--green-dark)">
                                <CustomText
                                  size={"12px"}
                                  weight={"400"}
                                  color={"var(--white)"}
                                >
                                  <FontAwesomeIcon
                                    icon={faPersonBreastfeeding}
                                  />
                                  ({tourBooking?.babies})
                                </CustomText>
                              </Tag>
                            )}
                          </Col>
                        </Col>
                      </Col>
                    </Row>
                  </Col>

                  {/* Amount */}
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
                      }).format(tourBooking?.amount)}
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

          {tourBookings && tourBookings.length > 0 && (
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
