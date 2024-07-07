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
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import badgeSave from "../../assets/images/badge_save.png";
dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function List({
  tours,
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
  const onChangeSlider = (value) => {
    console.log("Value change slider: ", value);
    const minPrice = value?.[0];
    const maxPrice = value?.[1];
    const review = pagination.review;

    handleTableChange(1, pagination.limit, minPrice, maxPrice, review);
  };

  const onChangePanigation = (page) => {
    const minPrice = pagination.minPrice;
    const maxPrice = pagination.maxPrice;
    const review = pagination.review;

    handleTableChange(page, pagination.limit, minPrice, maxPrice, review);
  };

  const onChangeRadioGroup = (e) => {
    console.log("radio checked", e.target.value);
    setValueRadio(e.target.value);

    const minPrice = pagination.minPrice;
    const maxPrice = pagination.maxPrice;
    const review = e.target.value;

    handleTableChange(1, pagination.limit, minPrice, maxPrice, review);
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
                      Tours List
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
          {/* Col filter */}
          <Col
            span={7}
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
                  background: "var(--white)",
                  padding: "20px",
                  textAlign: "left",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <CustomText
                  size={"16px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                >
                  <FontAwesomeIcon
                    icon={faFilter}
                    style={{
                      color: "var(--gray-dark)",
                      marginRight: "5px",
                    }}
                  />
                  Filters
                </CustomText>
              </Col>
              <Row
                style={{
                  width: "100%",
                  padding: "20px",
                  background: "var(--white)",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                }}
              >
                {/* Price */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    span={24}
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
                      Price
                    </CustomText>

                    <Slider
                      marks={marks}
                      range
                      defaultValue={[pagination.minPrice, pagination.maxPrice]}
                      min={0}
                      max={5000000}
                      onChangeComplete={onChangeSlider}
                    />
                  </Col>
                </Row>

                {/* Review */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    marginTop: "15px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    span={24}
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
                      Review
                    </CustomText>

                    <Radio.Group
                      onChange={onChangeRadioGroup}
                      value={valueRadio}
                    >
                      <Space direction="vertical">
                        <Radio value={""}>
                          <CustomText
                            size={"14px"}
                            weight={"400"}
                            color={"var(--gray-text)"}
                          >
                            All
                          </CustomText>
                        </Radio>
                        <Radio value={5}>
                          <Rate
                            disabled
                            value={5}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        </Radio>
                        <Radio value={4}>
                          <Rate
                            disabled
                            value={4}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        </Radio>
                        <Radio value={3}>
                          <Rate
                            disabled
                            value={3}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        </Radio>
                        <Radio value={2}>
                          <Rate
                            disabled
                            value={2}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        </Radio>
                        <Radio value={1}>
                          <Rate
                            disabled
                            value={1}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Col>
                </Row>
              </Row>
            </Row>

            {/* Need help */}
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
                    icon={faBlenderPhone}
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
                  Need Help?
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

          {/* Col tours list */}
          <Col span={17}>
            {tours && tours.length > 0 ? (
              tours.map((tour) => (
                <Row
                  key={tour.id}
                  style={{
                    width: "100%",
                    height: "220px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Thumbnail */}
                  <Col
                    span={7}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Image
                      src={tour.thumbnail}
                      preview={false}
                      width={"100%"}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease-in-out",
                      }}
                      className="image-hover-zoom"
                    />
                    <Col
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 9,
                        backgroundImage: `url(${badgeSave})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "70px",
                        height: "82px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        paddingTop: "13px",
                      }}
                    >
                      <CustomText
                        size={"12px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        SAVE
                      </CustomText>
                      <CustomText
                        size={"13px"}
                        weight={"700"}
                        color={"var(--white)"}
                      >
                        {((tour.discount / tour.price) * 100).toFixed(0)} %
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
                    {/* Review */}
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Rate
                        disabled
                        value={tour.rating}
                        character={({ index = 0 }) => customIcons[index + 1]}
                        style={{
                          fontSize: "15px",
                          color: "var(--orange)",
                          marginRight: "5px",
                        }}
                      />

                      <CustomText
                        size={"12px"}
                        weight={"400"}
                        color={"var(--black-text)"}
                      >
                        ({tour.numberOfRating})
                      </CustomText>
                    </Col>

                    {/* Name */}
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
                        {tour.name}
                      </CustomText>
                    </Col>

                    {/* Locations */}
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
                        size={"13px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        {tour.locations}
                      </CustomText>
                    </Col>

                    {/* Depart */}
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
                        size={"13px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        Depart at {tour.depart} at {tour.startTime}
                      </CustomText>
                    </Col>

                    {/* Slot */}
                    {/* <Col span={24}>
                      <CustomText
                        size={"14px"}
                        weight={"500"}
                        color={"var(--gray-text)"}
                      >
                        Remaining seats:
                      </CustomText>{" "}
                      <Tag color="var(--green-dark)">
                        <CustomText
                          size={"12px"}
                          weight={"400"}
                          color={"var(--white)"}
                        >
                          <FontAwesomeIcon icon={faUser} /> ({tour?.adults})
                        </CustomText>
                      </Tag>
                      <Tag color="var(--green-dark)">
                        <CustomText
                          size={"12px"}
                          weight={"400"}
                          color={"var(--white)"}
                        >
                          <FontAwesomeIcon icon={faChild} /> ({tour?.children})
                        </CustomText>
                      </Tag>
                      <Tag color="var(--green-dark)">
                        <CustomText
                          size={"12px"}
                          weight={"400"}
                          color={"var(--white)"}
                        >
                          <FontAwesomeIcon icon={faPersonBreastfeeding} /> (
                          {tour?.baby})
                        </CustomText>
                      </Tag>
                    </Col> */}

                    {/* Icons */}
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{
                          fontSize: "22px",
                          color: "var(--gray-light)",
                          display: "block",
                          padding: "5px",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          marginRight: "10px",
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faMapLocationDot}
                        style={{
                          fontSize: "22px",
                          color: "var(--gray-light)",
                          display: "block",
                          padding: "5px",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          marginRight: "10px",
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faVolumeHigh}
                        style={{
                          fontSize: "22px",
                          color: "var(--gray-light)",
                          display: "block",
                          padding: "5px",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          marginRight: "10px",
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faTruckPlane}
                        style={{
                          fontSize: "22px",
                          color: "var(--gray-light)",
                          display: "block",
                          padding: "5px",
                          border: "1px solid var(--border)",
                          borderRadius: "3px",
                          marginRight: "10px",
                        }}
                      />
                    </Col>
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
                      }).format(tour.price - tour.discount)}
                    </CustomText>

                    <CustomText
                      size={"18px"}
                      weight={"300"}
                      color={"var(--gray-light)"}
                      isItalic={true}
                      isStrikethrough={true}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour.price)}
                    </CustomText>

                    <CustomText
                      size={"12px"}
                      weight={"400"}
                      color={"var(--gray-light)"}
                    >
                      Per / person
                    </CustomText>

                    <Button
                      htmlType="submit"
                      size="middle"
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
                        link={`/tours/${tour.id}`}
                      >
                        Details
                      </CustomText>
                    </Button>
                  </Col>
                </Row>
              ))
            ) : (
              <Row
                style={{
                  width: "100%",
                  padding: "10px 0",
                }}
                justify={"center"}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                >
                  No tour found
                </CustomText>
              </Row>
            )}

            {tours && tours.length > 0 && (
              <Row
                style={{
                  width: "100%",
                  padding: "10px 0",
                }}
                justify={"center"}
              >
                <Pagination
                  pageSize={pagination.limit}
                  current={currentPage}
                  total={totalPages}
                  onChange={onChangePanigation}
                />
              </Row>
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
}
