import { Col, Row, Grid } from "antd";
import category1 from "../../assets/images/category-1.jpg";
import category2 from "../../assets/images/category-2.jpg";
import category3 from "../../assets/images/category-3.png";
import CustomText from "../common/CustomText";
import { Link } from "react-router-dom";

const { useBreakpoint } = Grid;

export default function Categories() {
  const screens = useBreakpoint();

  return (
    <Row
      style={{
        width: "100%",
        height: "675px",
        background: "white",
        padding: "60px 0",
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
        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{
            backgroundImage: `url(${category1})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            transition: "transform 0.3s ease",
            overflow: "hidden",
          }}
          className="hover-zoom"
        >
          <Link
            to="/"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "end",
              alignItems: "start",
              padding: "20px",
            }}
          >
            <CustomText
              size={"21px"}
              weight={"700"}
              color={"var(--white)"}
              link={"/"}
              isUppercase={true}
            >
              Special Offers
            </CustomText>
            <CustomText
              size={"14px"}
              weight={"400"}
              color={"var(--white)"}
              link={"/"}
            >
              1150 Locations
            </CustomText>
          </Link>
        </Col>

        <Col
          xxl={12}
          xl={12}
          lg={12}
          md={12}
          sm={24}
          xs={24}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "100%",
              paddingLeft: "10px",
              paddingBottom: "5px",
            }}
          >
            <Link
              to="/hotels"
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
                  height: "100%",
                  backgroundImage: `url(${category2})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "end",
                  borderRadius: "5px",
                  padding: "20px",
                  transition: "transform 0.3s ease",
                  overflow: "hidden",
                }}
                className="hover-zoom"
              >
                <Link
                  to="/"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CustomText
                    size={"21px"}
                    weight={"700"}
                    color={"var(--white)"}
                    isUppercase={true}
                    link={"/tours"}
                  >
                    Tours
                  </CustomText>
                  <CustomText
                    size={"14px"}
                    weight={"400"}
                    color={"var(--white)"}
                    link={"/tours"}
                  >
                    800 Locations
                  </CustomText>
                </Link>
              </Col>
            </Link>
          </Row>

          <Row
            style={{
              width: "100%",
              height: "100%",
              paddingLeft: "10px",
              paddingTop: "5px",
            }}
          >
            <Link
              to="/hotels"
              style={{
                width: "100%",
              }}
            >
              <Col
                xxl={24}
                xl={24}
                lg={24}
                md={12}
                sm={24}
                xs={24}
                style={{
                  height: "100%",
                  backgroundImage: `url(${category3})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "end",
                  borderRadius: "5px",
                  padding: "20px",
                  transition: "transform 0.3s ease",
                  overflow: "hidden",
                }}
                className="hover-zoom"
              >
                <Link
                  to="/"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CustomText
                    size={"21px"}
                    weight={"700"}
                    color={"var(--white)"}
                    link={"/hotels"}
                    isUppercase={true}
                  >
                    Hotels
                  </CustomText>
                  <CustomText
                    size={"14px"}
                    weight={"400"}
                    color={"var(--white)"}
                    link={"/hotels"}
                  >
                    1132 Locations
                  </CustomText>
                </Link>
              </Col>
            </Link>
          </Row>
        </Col>
      </Row>
    </Row>
  );
}
