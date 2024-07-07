import { Col, Row, Grid, Image, Card, Rate, Button, Tooltip, Tag } from "antd";
import item from "../../assets/images/hotels.jpg";
import CustomText from "../common/CustomText";
import { HeartOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotdog,
  faHotel,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const { useBreakpoint } = Grid;

export default function TopHotels({ hotels }) {
  const screens = useBreakpoint();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const getWishlistFromLocalStorage = () => {
      if (localStorage.getItem("wishlist")) {
        const data = JSON.parse(localStorage.getItem("wishlist"));
        setWishlist(data);
        console.log("wishlist: ", data);
      }
    };

    getWishlistFromLocalStorage();
  }, []);

  const handleAddWishlist = (hotelName) => {
    // Add tourId to wishlist
    const hotel = hotels?.find((hotel) => hotel?.name === hotelName);

    console.log("tour: ", hotel);

    // Check if tour is already in wishlist
    const isWishlist = wishlist?.some((item) => item.name === hotelName);
    if (isWishlist) {
      alert("Item is already in wishlist");
      return;
    }

    // Add tour to wishlist state
    setWishlist([...wishlist, hotel]);

    // Update localStorage
    const updatedWishlist = [...wishlist, hotel];

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    console.log("Updated wishlist: ", updatedWishlist);
  };

  return (
    <Row
      style={{
        width: "100%",
        height: "auto",
        background: "var(--bg-gray-light)",
        padding: "60px 0",
      }}
      justify={"center"}
    >
      <Row
        style={{
          width: screens.xxl || screens.xl ? "1320px" : "100%",
          height: "auto",
        }}
      >
        {/* Title */}
        <Col
          xxl={24}
          xl={24}
          lg={24}
          md={12}
          sm={24}
          xs={24}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomText
            size={"30px"}
            weight={"700"}
            color={"var(--gray-text)"}
            isUppercase={true}
          >
            <CustomText
              size={"30px"}
              weight={"700"}
              color={"var(--pink)"}
              isUppercase={true}
            >
              Top
            </CustomText>{" "}
            hotels
          </CustomText>

          <CustomText size={"20px"} weight={"400"} color={"var(--gray-dark)"}>
            "Specializing in crafting personalized hotel stays that ensure
            memorable experiences tailored to your preferences.
          </CustomText>
        </Col>
      </Row>

      <Row
        style={{
          width: screens.xxl || screens.xl ? "1320px" : "100%",
          height: "auto",
          paddingTop: "20px",
        }}
      >
        {hotels?.map((hotel) => (
          <Col
            key={hotel?.id}
            xxl={8}
            xl={8}
            lg={8}
            md={8}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
              padding: "5px",
            }}
          >
            <Card
              hoverable
              style={{
                width: "100%",
              }}
            >
              <Link
                to={`/hotels/${hotel?.id}`}
                style={{
                  width: "100%",
                }}
              >
                <Col
                  xxl={24}
                  xl={24}
                  lg={24}
                  md={24}
                  sm={24}
                  xs={24}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                  }}
                >
                  <Image
                    src={hotel?.thumbnailUrls?.[0]}
                    preview={false}
                    width={"100%"}
                    style={{
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      height: "280px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease-in-out",
                    }}
                    className="image-hover-zoom"
                  />
                  <Col
                    style={{
                      width: "100%",
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      background: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1))`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                      padding: "15px",
                    }}
                  >
                    <CustomText
                      size={"15px"}
                      weight={"500"}
                      color={"var(--white)"}
                    >
                      <FontAwesomeIcon
                        icon={faHotel}
                        style={{
                          marginRight: "5px",
                        }}
                      />
                      {hotel?.name}
                    </CustomText>

                    {/* <CustomText
                    size={"20px"}
                    weight={"500"}
                    color={"var(--white)"}
                  >
                    $100
                  </CustomText> */}
                  </Col>
                </Col>
              </Link>
              <Row
                style={{
                  padding: "15px",
                }}
              >
                <Col
                  xxl={20}
                  xl={20}
                  lg={20}
                  md={20}
                  sm={20}
                  xs={20}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    gap: "5px",
                  }}
                >
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--gray-text)"}
                  >
                    {hotel?.address}
                  </CustomText>
                  <CustomText
                    size={"13px"}
                    weight={"400"}
                    color={"var(--gray-text)"}
                  >
                    Type rooms:{" "}
                    {[...new Set(hotel?.rooms?.map((room) => room?.type))].map(
                      (type, index) => (
                        <Tag color="var(--green-dark)" key={index}>
                          <CustomText
                            size={"12px"}
                            weight={"400"}
                            color={"var(--white)"}
                          >
                            {type}
                          </CustomText>
                        </Tag>
                      )
                    )}
                  </CustomText>

                  <Rate
                    disabled
                    allowHalf
                    value={hotel?.rating}
                    style={{
                      fontSize: "15px",
                    }}
                  />
                </Col>
                <Col
                  xxl={4}
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={4}
                  style={{
                    width: "100%",
                    textAlign: "right",
                  }}
                >
                  <CustomText
                    size={"30px"}
                    weight={"500"}
                    color={"var(--gray-light)"}
                    onClick={() => handleAddWishlist(hotel?.name)}
                  >
                    <Tooltip
                      title="Add to wishlist"
                      overlayInnerStyle={{
                        borderRadius: "3px",
                        fontFamily: "Montserrat",
                      }}
                      color="var(--pink)"
                    >
                      <HeartOutlined />
                    </Tooltip>
                  </CustomText>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Button view more */}
      <Row
        style={{
          width: screens.xxl || screens.xl ? "1320px" : "100%",
          height: "auto",
          paddingTop: "20px",
        }}
        justify={"center"}
      >
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
            link={`/hotels/list?review=`}
          >
            View all Hotels
          </CustomText>
        </Button>
      </Row>
    </Row>
  );
}
