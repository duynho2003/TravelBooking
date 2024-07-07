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

export default function ProminentHotelAreas({ provinces }) {
  const screens = useBreakpoint();

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
              Prominent
            </CustomText>{" "}
            hotel areas
          </CustomText>

          <CustomText size={"20px"} weight={"400"} color={"var(--gray-dark)"}>
            Offering top-rated hotel stays tailored to your preferences.
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
        {provinces?.slice(0, 6)?.map(
          (province) =>
            province.quantityHotels > 0 && (
              <Col
                key={province?.id}
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
                    // to={`/hotels/${hotel?.id}`}
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
                        borderRadius: "5px",
                      }}
                    >
                      <Image
                        src={province?.hotels?.[0]?.thumbnailUrls?.[0]}
                        preview={false}
                        width={"100%"}
                        style={{
                          borderRadius: "5px",
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
                          {province?.name}
                        </CustomText>

                        <CustomText
                          size={"20px"}
                          weight={"500"}
                          color={"var(--white)"}
                        >
                          {province?.quantityHotels} Locations
                        </CustomText>
                      </Col>
                    </Col>
                  </Link>
                </Card>
              </Col>
            )
        )}
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
            link={"/hotels/list"}
          >
            View all Hotels
          </CustomText>
        </Button>
      </Row>
    </Row>
  );
}
