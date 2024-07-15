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
  Tooltip,
  notification,
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
  faHeartCircleMinus,
  faWifi,
  faDumbbell,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faClock, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  FrownOutlined,
  HeartOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import badgeSave from "../../assets/images/badge_save.png";
import {
  getAllWishlistsByUserId,
  deleteWishlist,
} from "../../features/wishlist/WishlistSlice";
import { useDispatch } from "react-redux";

dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function List({ userId, wishlists }) {
  // Ant Design
  const screens = useBreakpoint();
  const dispatch = useDispatch();

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
  const handleRemoveWishlist = async (wishlistId) => {
    try {
      const action = await dispatch(deleteWishlist(wishlistId));

      console.log("action: ", action);

      if (deleteWishlist.fulfilled.match(action)) {
        if (action?.payload?.status === 200) {
          notification.success({
            message: "Remove item from wishlist successful",
            description: "Successfully removed the item from your wishlist",
          });

          dispatch(getAllWishlistsByUserId(userId));
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error";
          notification.error({
            message: "Remove item from wishlist error",
            description: error,
          });
        }
      } else if (deleteWishlist.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Remove item from wishlist error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System error",
        description:
          "The server couldn't fulfill a valid request due to an issue with the server.",
      });
    }
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
                      Wishlist
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
                      value={[0, 5000000]}
                      min={0}
                      max={5000000}
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

                    <Radio.Group value={""}>
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
            {wishlists && wishlists?.length > 0 ? (
              wishlists.map((item) => (
                <Row
                  key={item?.id}
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
                      src={item?.thumbnail}
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
                    {/* Review */}
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "10px",
                        }}
                      >
                        {item?.type === "TOUR" ? (
                          <Rate
                            disabled
                            value={item?.rating}
                            character={({ index = 0 }) =>
                              customIcons[index + 1]
                            }
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        ) : (
                          <Rate
                            disabled
                            value={item?.rating}
                            style={{
                              fontSize: "15px",
                              color: "var(--orange)",
                              marginRight: "5px",
                            }}
                          />
                        )}

                        <CustomText
                          size={"12px"}
                          weight={"400"}
                          color={"var(--black-text)"}
                        >
                          ({item?.numberOfRating})
                        </CustomText>
                      </Col>

                      <Col>
                        <CustomText
                          size={"24px"}
                          weight={"400"}
                          color={"var(--pink)"}
                          isButton={true}
                          onClick={() => handleRemoveWishlist(item?.id)}
                        >
                          <Tooltip
                            title="Remove to wishlist"
                            overlayInnerStyle={{
                              borderRadius: "3px",
                              fontFamily: "Montserrat",
                            }}
                            color="var(--pink)"
                          >
                            <FontAwesomeIcon icon={faHeartCircleMinus} />
                          </Tooltip>
                        </CustomText>
                      </Col>
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
                        {item?.name}
                      </CustomText>
                    </Col>

                    {/* Description */}
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
                        {item?.description}
                      </CustomText>
                    </Col>

                    {/* Icons */}

                    {item?.type === "TOUR" ? (
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
                    ) : (
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
                          icon={faWifi}
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
                          icon={faDumbbell}
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
                          icon={faUtensils}
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
                    )}
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
                    {item?.type === "TOUR" ? (
                      <CustomText
                        size={"24px"}
                        weight={"400"}
                        color={"var(--pink)"}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item?.price)}
                      </CustomText>
                    ) : (
                      <CustomText
                        size={"24px"}
                        weight={"400"}
                        color={"var(--pink)"}
                      >
                        {item?.price}
                      </CustomText>
                    )}

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
                      {item?.type === "TOUR" ? (
                        <CustomText
                          size={"14px"}
                          weight={"600"}
                          color={"var(--white)"}
                          isButton={true}
                          link={`/tours/${item.itemId}`}
                        >
                          Details
                        </CustomText>
                      ) : (
                        <CustomText
                          size={"14px"}
                          weight={"600"}
                          color={"var(--white)"}
                          isButton={true}
                          link={`/hotels/${item.itemId}`}
                        >
                          Details
                        </CustomText>
                      )}
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
                  No item found
                </CustomText>
              </Row>
            )}
          </Col>
        </Row>
      </Row>
    </>
  );
}
