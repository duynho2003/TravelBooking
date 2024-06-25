import { Col, Row, Grid, Button } from "antd";
import CustomText from "../common/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faSitemap,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import plan from "../../assets/images/plan.jpg";

const { useBreakpoint } = Grid;

export default function Plan() {
  const screens = useBreakpoint();

  return (
    <Row
      style={{
        width: "100%",
        height: "auto",
        background: "var(--white)",
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
            Plan{" "}
            <CustomText
              size={"30px"}
              weight={"700"}
              color={"var(--pink)"}
              isUppercase={true}
            >
              you tour
            </CustomText>{" "}
            easly
          </CustomText>

          <CustomText size={"20px"} weight={"400"} color={"var(--gray-dark)"}>
            Quisque at tortor a libero posuere laoreet vitae sed arcu. Curabitur
            consequat.
          </CustomText>
        </Col>
      </Row>

      <Row
        style={{
          width: screens.xxl || screens.xl ? "1320px" : "100%",
          height: "auto",
          paddingTop: "20px",
        }}
        justify={"space-between"}
      >
        {/* List tours */}
        <Col
          xxl={7}
          xl={7}
          lg={7}
          md={7}
          sm={24}
          xs={24}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            textAlign: "center",
            padding: "20px",
            borderRadius: "5px",
            border: "2px solid var(--bg-gray-light)",
          }}
        >
          <CustomText size={"34px"} weight={"500"} color={"var(--pink)"}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </CustomText>

          <CustomText size={"18px"} weight={"500"} color={"var(--gray-text)"}>
            Itineraries meticulously crafted
          </CustomText>

          <CustomText size={"14px"} weight={"400"} color={"var(--gray-light)"}>
            Explore meticulously crafted itineraries tailored to maximize your
            experience, showcasing the best of each destination with expertly
            planned activities and sightseeing opportunities.
          </CustomText>
        </Col>

        <Col
          xxl={7}
          xl={7}
          lg={7}
          md={7}
          sm={24}
          xs={24}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            textAlign: "center",
            padding: "20px",
            borderRadius: "5px",
            border: "2px solid var(--bg-gray-light)",
          }}
        >
          <CustomText size={"34px"} weight={"500"} color={"var(--pink)"}>
            <FontAwesomeIcon icon={faUtensils} />
          </CustomText>

          <CustomText size={"18px"} weight={"500"} color={"var(--gray-text)"}>
            Accommodation and meals provided
          </CustomText>

          <CustomText size={"14px"} weight={"400"} color={"var(--gray-light)"}>
            Enjoy comprehensive packages where accommodation and meals are
            included, ensuring comfort and convenience throughout your journey.
          </CustomText>
        </Col>

        <Col
          xxl={7}
          xl={7}
          lg={7}
          md={7}
          sm={24}
          xs={24}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
            textAlign: "center",
            padding: "20px",
            borderRadius: "5px",
            border: "2px solid var(--bg-gray-light)",
          }}
        >
          <CustomText size={"34px"} weight={"500"} color={"var(--pink)"}>
            <FontAwesomeIcon icon={faSitemap} />
          </CustomText>

          <CustomText size={"18px"} weight={"500"} color={"var(--gray-text)"}>
            Seamless organization
          </CustomText>

          <CustomText size={"14px"} weight={"400"} color={"var(--gray-light)"}>
            Experience seamless organization from start to finish, with every
            detail meticulously arranged to provide you with a stress-free and
            enjoyable travel experience.
          </CustomText>
        </Col>
      </Row>

      <Row
        style={{
          width: screens.xxl || screens.xl ? "1320px" : "100%",
          height: "400px",
          paddingTop: "20px",
        }}
        justify={"center"}
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
            backgroundImage: `url(${plan})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <CustomText
            size={"32px"}
            weight={"700"}
            color={"var(--white)"}
            isUppercase={true}
          >
            Your Perfect <br /> Tour Experience
          </CustomText>
          <CustomText size={"24px"} weight={"300"} color={"var(--white)"}>
            Activities and accommodations
          </CustomText>

          <Button
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
              link={"/"}
              isButton={true}
            >
              Read more
            </CustomText>
          </Button>
        </Col>
      </Row>
    </Row>
  );
}
