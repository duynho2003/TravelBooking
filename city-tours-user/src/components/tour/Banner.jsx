import { Button, Carousel, Col, Row, Grid, Rate } from "antd";
import slider2 from "../../assets/images/slider-1.jpg";
import slider1 from "../../assets/images/slider-2.jpg";
import slider3 from "../../assets/images/slider-3.jpg";
import CustomText from "../common/CustomText";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function Banner({ tour }) {
  const screens = useBreakpoint();

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  return (
    <Row
      style={{
        width: "100%",
        height: "400px",
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
          height: "400px",
          backgroundImage: `url(${slider1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Row
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Col
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              left: 0,
              background: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.1))`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "15px",
            }}
          >
            <Row
              style={{
                width: screens.xxl || screens.xl ? "1320px" : "100%",
                height: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={16}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CustomText
                  size={"36px"}
                  weight={"700"}
                  color={"var(--white)"}
                  isUppercase={true}
                >
                  {tour?.name}
                </CustomText>

                <CustomText size={"14px"} weight={"500"} color={"var(--white)"}>
                  {tour?.address}
                  <Rate
                    disabled
                    value={tour?.rating || 5}
                    character={({ index = 0 }) => customIcons[index + 1]}
                    style={{
                      fontSize: "15px",
                      color: "var(--orange)",
                      marginRight: "5px",
                    }}
                  />
                  {` (${tour?.numberOfRating})`}
                </CustomText>
              </Col>
              <Col
                span={8}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                {/* <CustomText size={"14px"} weight={"400"} color={"var(--white)"}>
                  price{" "}
                </CustomText> */}
                <CustomText
                  size={"60px"}
                  weight={"400"}
                  color={"var(--blue-light)"}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(tour?.priceAdult - tour?.discount)}
                </CustomText>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
