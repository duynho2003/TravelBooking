import {
  faEnvelope,
  faPhone,
  faUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Grid, Select } from "antd";
import CustomText from "./CustomText";
import {
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  PinterestOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function Footer() {
  const screens = useBreakpoint();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      {/* Row top */}
      <Row
        style={{
          width: "100%",
          height: "400px",
          background: "var(--footer)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "var(--footer)",
          }}
          justify={"space-between"}
        >
          {/* Footer top */}
          <Row
            style={{
              width: "100%",
              height: "auto",
              padding: "50px 0 0 0",
              borderBottom: "1px solid var(--gray-light)",
            }}
          >
            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xs={6}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                gap: "15px",
              }}
            >
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                NEXT HELP?
              </CustomText>

              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--yellow-light)"}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{
                    marginRight: "3px",
                  }}
                />
                +45 423 445 99
              </CustomText>

              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--yellow-light)"}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{
                    marginRight: "3px",
                  }}
                />
                help@citytours.com
              </CustomText>
            </Col>

            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xs={6}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                gap: "10px",
              }}
            >
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                ABOUT
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                About us
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                FAQ
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Login
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Register
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Terms and condition
              </CustomText>
            </Col>

            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xs={6}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                gap: "10px",
              }}
            >
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                DISCOVER
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Community blog
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Tour guide
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Wishlist
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"}>
                Gallery
              </CustomText>
            </Col>

            <Col
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={6}
              xs={6}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                SETTINGS
              </CustomText>

              <Select
                defaultValue="English"
                suffixIcon={<FontAwesomeIcon icon={faUpDown} />}
                style={{
                  width: 200,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "English",
                    label: "English",
                  },
                  {
                    value: "French",
                    label: "French",
                  },
                  {
                    value: "Spanish",
                    label: "Spanish",
                  },
                  {
                    value: "Russian",
                    label: "Russian",
                  },
                ]}
              />

              <Select
                defaultValue="USD"
                suffixIcon={<FontAwesomeIcon icon={faUpDown} />}
                style={{
                  width: 200,
                }}
                onChange={handleChange}
                options={[
                  {
                    value: "USD",
                    label: "USD",
                  },
                  {
                    value: "EUR",
                    label: "EUR",
                  },
                  {
                    value: "GBP",
                    label: "GBP",
                  },
                  {
                    value: "RUB",
                    label: "RUB",
                  },
                ]}
              />
            </Col>
          </Row>

          {/* Footer bottom */}
          <Row
            style={{
              width: "100%",
              height: "auto",
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <FacebookOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <TwitterOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <GoogleOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <InstagramOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <PinterestOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                <YoutubeOutlined />
              </CustomText>
            </Col>

            <Col
              xxl={24}
              xl={24}
              lg={24}
              md={24}
              sm={24}
              xs={24}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CustomText
                size={"13px"}
                weight={"300"}
                color={"var(--gray-light)"}
              >
                © Citytours 2024
              </CustomText>
            </Col>
          </Row>
        </Row>
      </Row>
    </>
  );
}
