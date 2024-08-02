import {
  Col,
  Row,
  Grid,
  Image,
  Card,
  Rate,
  Button,
  Tooltip,
  Tag,
  notification,
} from "antd";
import item from "../../assets/images/item.webp";
import CustomText from "../common/CustomText";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChild,
  faPersonBreastfeeding,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import badgeSave from "../../assets/images/badge_save.png";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { createWishlist } from "../../features/wishlist/WishlistSlice";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function TopTours({ userId, tours }) {
  const screens = useBreakpoint();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  const handleAddWishlist = async (tourId) => {
    if (!userId) {
      alert("Please login before adding to wishlists");
      navigate("/login");
      return;
    }

    const tour = tours?.find((tour) => tour?.id === tourId);

    console.log("tour: ", tour);

    const newData = {
      name: tour?.name,
      rating: tour?.rating,
      numberOfRating: tour?.numberOfRating,
      price:
        tour?.priceAdult - tour?.discount != null
          ? (tour?.priceAdult - tour?.discount).toString()
          : "",
      description: tour?.description,
      thumbnail: tour?.thumbnail,
      type: "TOUR",
      itemId: tour?.id,
      userId: userId,
    };

    console.log("newData: ", newData);

    try {
      const action = await dispatch(createWishlist(newData));

      console.log("action: ", action);

      if (createWishlist.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Add item to wishlist successful",
            description: "Successfully added the item to your wishlist",
          });
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error";
          notification.error({
            message: "Add item to wishlist error",
            description: error,
          });
        }
      } else if (createWishlist.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Add item to wishlist error",
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

  const findClosestStartDate = (tourTimes) => {
    // Kiểm tra tourTimes có phải là mảng không
    if (!Array.isArray(tourTimes)) {
      console.error("tourTimes is not an array:", tourTimes);
      return null;
    }

    // Kiểm tra mảng không rỗng
    if (tourTimes.length === 0) {
      return null;
    }

    const today = dayjs();

    // Chuyển đổi tourTimes thành mảng của các đối tượng có startDate
    const futureTourTimes = tourTimes
      .map((time) => ({
        ...time,
        startDate: dayjs(time.startDate, "HH:mm:ss - DD/MM/YYYY"),
      }))
      .filter((time) => time.startDate.isAfter(today));

    // Kiểm tra không có ngày trong tương lai
    if (futureTourTimes.length === 0) {
      return null;
    }

    // Tìm ngày gần nhất
    const closestTime = futureTourTimes.reduce((closest, current) => {
      return current.startDate.isBefore(closest.startDate) ? current : closest;
    });

    return closestTime.startDate.format("HH:mm:ss - DD/MM/YYYY");
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
            tours
          </CustomText>

          <CustomText size={"20px"} weight={"400"} color={"var(--gray-dark)"}>
            Specializing in creating personalized, unforgettable travel
            experiences that guarantee a lifetime of memories.
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
        {/* List tours */}
        {tours?.map((tour) => (
          <Col
            key={tour?.id}
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
              position: "relative",
            }}
          >
            <Col
              style={{
                position: "absolute",
                top: 5,
                right: 5,
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
              <CustomText size={"12px"} weight={"500"} color={"var(--white)"}>
                SAVE
              </CustomText>
              <CustomText size={"13px"} weight={"700"} color={"var(--white)"}>
                {((tour?.discount / tour?.priceAdult) * 100).toFixed(0)} %
              </CustomText>
            </Col>

            <Card
              hoverable
              style={{
                width: "100%",
              }}
            >
              <Link
                to={`/tours/${tour?.id}`}
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
                    src={tour?.thumbnail}
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
                    <div className="truncated-text">
                      <CustomText
                        size={"15px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        <FontAwesomeIcon
                          icon={faPlaneDeparture}
                          style={{
                            marginRight: "5px",
                          }}
                        />
                        {tour?.name}
                      </CustomText>
                    </div>

                    <Col
                      span={8}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "end",
                      }}
                    >
                      <CustomText
                        size={"20px"}
                        weight={"500"}
                        color={"var(--white)"}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(tour?.priceAdult - tour?.discount)}
                      </CustomText>

                      <CustomText
                        size={"12px"}
                        weight={"500"}
                        color={"var(--gray-light)"}
                        isItalic={true}
                        isStrikethrough={true}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(tour?.priceAdult)}
                      </CustomText>
                    </Col>
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
                    Depart at: {tour?.depart}
                  </CustomText>
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--gray-text)"}
                  >
                    Start Date:{" "}
                    {findClosestStartDate(tour?.tourTimes) ||
                      "No upcoming dates"}
                  </CustomText>
                  <Col
                    style={{
                      marginBottom: "4px",
                    }}
                  >
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
                        <FontAwesomeIcon icon={faChild} /> ({tour?.child})
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
                  </Col>

                  <Rate
                    disabled
                    defaultValue={tour?.rating}
                    character={({ index = 0 }) => customIcons[index + 1]}
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
                    // link={"/sss"}
                    onClick={() => handleAddWishlist(tour?.id)}
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
            link={`/tours/list?minPrice=0&maxPrice=500000000&review=&rating=&depart=&startDate=&completed=`}
          >
            View all Tours
          </CustomText>
        </Button>
      </Row>
    </Row>
  );
}
