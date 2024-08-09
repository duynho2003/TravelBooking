import {
  faEnvelope,
  faLocation,
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
  XOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function Footer({ websiteInfo }) {
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
                NEED HELP?
              </CustomText>

              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--yellow-light)"}
                link={"tel:0981578920"}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{
                    marginRight: "3px",
                  }}
                />
                +{websiteInfo?.phone || "(84) 0981578920"}
              </CustomText>

              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--yellow-light)"}
                link={"mailto:city_tours@gmail.com"}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{
                    marginRight: "3px",
                  }}
                />
                {websiteInfo?.email || "city_tours@gmail.com"}
              </CustomText>

              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--yellow-light)"}
              >
                <FontAwesomeIcon
                  icon={faLocation}
                  style={{
                    marginRight: "3px",
                  }}
                />
                {websiteInfo?.address || "590 Cach Mang Thang Tam"}
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

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"} link={"/blogs/list?page=1&limit=4&search="}>
                Blogs
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"} link={"/tours/list?minPrice=0&maxPrice=500000000&review=&rating=&depart=&startDate=&completed="}>
                Tours
              </CustomText>

              <CustomText size={"14px"} weight={"300"} color={"var(--white)"} link={"/wishlist"}>
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
              {/* <CustomText size={"14px"} weight={"600"} color={"var(--white)"}>
                SETTINGS
              </CustomText> */}

              {/* <Select
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
              /> */}
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
              <CustomText size={"14px"} weight={"600"} color={"var(--white)"} link={"https://www.facebook.com"}>
                <FacebookOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"} link={"https://x.com/"}>
                <XOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"} link={"https://www.instagram.com/"}>
                <InstagramOutlined />
              </CustomText>

              <CustomText size={"14px"} weight={"600"} color={"var(--white)"} link={"https://www.pinterest.com/"}>
                <PinterestOutlined />
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
