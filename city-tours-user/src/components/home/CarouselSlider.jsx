import { Button, Carousel, Col, Row } from "antd";
import slider2 from "../../assets/images/slider-1.jpg";
import slider1 from "../../assets/images/slider-2.jpg";
import slider3 from "../../assets/images/slider-3.jpg";
import CustomText from "../common/CustomText";

export default function CarouselSlider() {
  return (
    <Row
      style={{
        width: "100%",
        height: "550px",
      }}
    >
      <Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24}>
        <Carousel autoplay autoplaySpeed={2500}>
          <div>
            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                height: "550px",
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
              <CustomText size={"46px"} weight={"700"} color={"var(--white)"}>
                PHU QUOC
              </CustomText>

              <CustomText size={"40px"} weight={"700"} color={"var(--white)"}>
                Explore Phu Quoc{"'"}s Charm on a Cable Car Adventure
              </CustomText>

              <CustomText size={"21px"} weight={"400"} color={"var(--white)"}>
                Embark on an unforgettable journey across Phu Quoc Island with
                our scenic cable car tour
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
                  marginTop: "20px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"600"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Read more
                </CustomText>
              </Button>
            </Col>
          </div>
          <div>
            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                height: "550px",
                backgroundImage: `url(${slider2})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText size={"46px"} weight={"700"} color={"var(--white)"}>
                THE GOLDEN BRIDGE
              </CustomText>

              <CustomText size={"40px"} weight={"700"} color={"var(--white)"}>
                Discover the Golden Bridge Tour in Danang
              </CustomText>

              <CustomText size={"21px"} weight={"400"} color={"var(--white)"}>
                Embark on a captivating journey to the famous Golden Bridge in
                Danang
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
                  marginTop: "20px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"600"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Read more
                </CustomText>
              </Button>
            </Col>
          </div>
          <div>
            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                height: "550px",
                backgroundImage: `url(${slider3})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText size={"46px"} weight={"700"} color={"var(--white)"}>
                HO NUI COC
              </CustomText>

              <CustomText size={"40px"} weight={"700"} color={"var(--white)"}>
                Explore the Beauty of Ho Nui Coc Tour Thai Nguyen - Lang Son
              </CustomText>

              <CustomText size={"21px"} weight={"400"} color={"var(--white)"}>
                Embark on an exciting journey to Ho Nui Coc, spanning Thai
                Nguyen and Lang Son provinces
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
                  marginTop: "20px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"600"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Read more
                </CustomText>
              </Button>
            </Col>
          </div>
        </Carousel>
      </Col>
    </Row>
  );
}
