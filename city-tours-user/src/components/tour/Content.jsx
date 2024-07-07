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
import { getTourById } from "../../features/tour/TourSlice";
import { useEffect, useState } from "react";
import { tourBooking } from "../../features/tour/TourSlice";
dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function Content({ tour }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sub = useSelector((state) => state.auth?.info?.sub);

  const [quantityAdults, setQuantityAdults] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [quantityBaby, setQuantityBaby] = useState(0);

  // Ant Design
  const screens = useBreakpoint();

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  const formatDays = (dates) => {
    if (!dates || dates.length === 0) return "";
    return dates.map((schedule) => schedule.date).join(" - ");
  };

  const columns = [
    {
      title: "Day of Week",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const dateParts = text.split("-");
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      },
    },

    {
      title: "Activities",
      dataIndex: "activities",
      key: "activities",
    },
  ];

  const dataSource = tour?.schedules?.map((day, index) => ({
    key: index,
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    activities: day.activities,
  }));

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

  const handleNavigateCheckout = (tourId) => {
    if (sub) {
      dispatch(
        tourBooking({
          tourId: tourId,
          adults: quantityAdults,
          children: quantityChildren,
          baby: quantityBaby,
        })
      );
      navigate(`/checkout/${tourId}`);
    } else {
      navigate("/login");
    }
  };

  const [wishlist, setWishlist] = useState([]);

  // useEffect for loading data
  useEffect(() => {
    const getWishlistFromLocalStorage = () => {
      const data = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(data);
      console.log("wishlist: ", data);
    };

    getWishlistFromLocalStorage();
  }, [dispatch]);

  const handleAddWishlist = (tourId) => {
    // Check if tour is already in wishlist
    const isWishlist = wishlist?.some((item) => item.id === tourId);
    if (isWishlist) {
      alert("Tour is already in wishlist");
      return;
    }

    // Add tour to wishlist state
    setWishlist([...wishlist, tour], console.log("wishlist: ", wishlist));

    // Update localStorage
    const updatedWishlist = [...wishlist, tour];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    console.log("Updated wishlist: ", updatedWishlist);
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
                      Tours
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
                  icon={faHotel}
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
                  Hotel
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
                  icon={faClock}
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
                  3 days
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
                  Accessibility
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
                  icon={faHeart}
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
                  999 likes
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
                  icon={faVolumeHigh}
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
                  Audio guide
                </CustomText>
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
                  {tour?.description}
                </CustomText>
              </Col>
            </Row>

            {/* Schedules */}
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
                  Schedules
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
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  style={{
                    width: "100%",
                  }}
                />
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
                  htmlType="submit"
                  size="large"
                  className="hover-button"
                  style={{
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
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
                    {tour?.numberOfRating} Reviews{" "}
                    <Rate
                      disabled
                      value={tour?.numberOfRating}
                      character={({ index = 0 }) => customIcons[index + 1]}
                      style={{
                        fontSize: "15px",
                        color: "var(--orange)",
                        marginRight: "5px",
                      }}
                    />
                  </CustomText>
                </Row>

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
                        John Doe
                      </CustomText>
                    </Col>

                    <Col>
                      <CustomText
                        size={"12px"}
                        weight={"400"}
                        color={"var(--black-light)"}
                        isItalic={true}
                      >
                        26/06/2024
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
                        "Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed a lorem quis neque interdum consequat ut sed
                        sem. Duis quis tempor nunc. Interdum et malesuada fames
                        ac ante ipsum primis in faucibus."
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
                        defaultValue={5}
                        character={({ index = 0 }) => customIcons[index + 1]}
                        style={{
                          fontSize: "15px",
                          color: "var(--orange)",
                          marginRight: "15px !important",
                        }}
                      />
                    </Col>
                  </Row>
                </Row>
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
            <Button
              size="large"
              className="hover-button"
              style={{
                width: "100%",
                background: "var(--pink)",
                border: "var(--green-dark)",
                color: "var(--white)",
                borderRadius: "3px",
                cursor: "pointer",
              }}
              disabled
            >
              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--white)"}
                // isButton={true}
                isUppercase={true}
              >
                View on map (Updating)
              </CustomText>
            </Button>

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
                {/* Date and time */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={11}
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
                      Depart at
                    </CustomText>

                    <Input size="small" value={tour?.depart} readOnly />
                  </Col>

                  <Col
                    xl={11}
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
                        icon={faClock}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-text)",
                          marginRight: "5px",
                        }}
                      />
                      Start Time
                    </CustomText>
                    <Input value={tour?.startTime} readOnly />
                  </Col>
                </Row>

                {/* Adults, children and baby */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={7}
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
                        icon={faUser}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Adults{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.adults}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={1}
                      min={1}
                      max={tour?.adults}
                      onChange={onChangeAdults}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>

                  <Col
                    xl={7}
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
                        icon={faChild}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Children{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.children}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={0}
                      min={0}
                      max={tour?.children}
                      onChange={onChangeChildren}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>

                  <Col
                    xl={7}
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
                        icon={faPersonBreastfeeding}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Baby{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.baby}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={0}
                      min={0}
                      max={tour?.baby}
                      onChange={onChangeBaby}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>
                </Row>

                {/* Adults */}
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
                      Adults ({quantityAdults} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.price - tour?.discount)}
                      )
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
                        quantityAdults * (tour?.price - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Children */}
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
                      Children ({quantityChildren} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.price - tour?.discount)}
                      )
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
                        quantityChildren * (tour?.price - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Baby */}
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
                      Baby ({quantityBaby} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.price - tour?.discount)}
                      )
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
                      }).format(quantityBaby * (tour?.price - tour?.discount))}
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
                      }).format(tour?.discount)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Origin price */}
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
                      Origin price / person
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
                      }).format(tour?.price)}
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
                      Total price / person
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
                      }).format(tour?.price - tour?.discount)}
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
                      }).format(
                        quantityAdults * (tour?.price - tour?.discount) +
                          quantityChildren * (tour?.price - tour?.discount) +
                          quantityBaby * (tour?.price - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                <Button
                  htmlType="submit"
                  size="large"
                  className="hover-button"
                  onClick={() => handleNavigateCheckout(tour?.id)}
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
                  onClick={() => handleAddWishlist(tour?.id)}
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
