import {
  faAngleDown,
  faArrowRightFromBracket,
  faBagShopping,
  faHotel,
  faPhone,
  faPlaneDeparture,
  faSearch,
  faTrashCan,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCircleUser,
  faHeart,
  faMoneyBill1,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Row,
  Grid,
  Image,
  Menu,
  Badge,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  Spin,
} from "antd";
import CustomText from "./CustomText";
import logo from "../../assets/images/logo.png";
import product from "../../assets/images/product.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Cookies from "js-cookie";
import authApi from "../../services/auth/AuthApi";
import { initInfoBeforeReload, logout } from "../../features/auth/AuthSlice";
import { logoutCustomer } from "../../features/customer/CustomerSlice";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function Header({ websiteInfo }) {
  const { control, handleSubmit, reset } = useForm({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sub = useSelector((state) => state.auth?.info?.sub);

  // Local state
  const [isSearchBlogOpen, setIsSearchBlogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowSearchBlog = () => {
    setIsSearchBlogOpen(true);
  };

  const handleCancelSearchBlog = () => {
    setIsSearchBlogOpen(false);
  };

  const handleSearchBlog = (value) => {
    console.log("value: ", value);
  };

  const onSubmit = (data) => {
    console.log("data: ", data);

    navigate(`/blogs/list?search=${data.search}`);
    setIsSearchBlogOpen(false);
    reset();
  };

  const screens = useBreakpoint();

  const navigations = [
    // {
    //   label: (
    //     <>
    //       <CustomText size={"14px"} weight={"600"} color={"var(--black-text)"}>
    //         Home{" "}
    //         <FontAwesomeIcon
    //           icon={faAngleDown}
    //           style={{
    //             marginLeft: "5px",
    //             fontSize: "10px",
    //           }}
    //         />
    //       </CustomText>
    //     </>
    //   ),
    //   key: "Home",
    // },

    {
      label: (
        <>
          <CustomText size={"14px"} weight={"600"} color={"var(--black-text)"}>
            Tours{" "}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                marginLeft: "5px",
                fontSize: "10px",
              }}
            />
          </CustomText>
        </>
      ),
      key: "Tours",
      children: [
        {
          key: "2",
          label: (
            <>
              <CustomText
                size={"13px"}
                weight={"400"}
                color={"var(--black-text)"}
                link={`/tours/list?minPrice=0&maxPrice=500000000&review=&rating=&depart=&startDate=&completed=`}
              >
                All Tours List
              </CustomText>
            </>
          ),
        },
      ],
    },

    {
      label: (
        <>
          <CustomText size={"14px"} weight={"600"} color={"var(--black-text)"}>
            Hotels{" "}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                marginLeft: "5px",
                fontSize: "10px",
              }}
            />
          </CustomText>
        </>
      ),
      key: "Hotels",
      children: [
        {
          key: "5",
          label: (
            <>
              <CustomText
                size={"13px"}
                weight={"400"}
                color={"var(--black-text)"}
                link={"/hotels/list"}
              >
                All Hotels List
              </CustomText>
            </>
          ),
        },
      ],
    },

    {
      label: (
        <>
          <CustomText size={"14px"} weight={"600"} color={"var(--black-text)"}>
            Blogs{" "}
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                marginLeft: "5px",
                fontSize: "10px",
              }}
            />
          </CustomText>
        </>
      ),
      key: "Blogs",
      children: [
        {
          key: "5",
          label: (
            <>
              <CustomText
                size={"13px"}
                weight={"400"}
                color={"var(--black-text)"}
                link={`/blogs/list?page=1&limit=5&search=`}
              >
                All Blogs List
              </CustomText>
            </>
          ),
        },
      ],
    },
  ];

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(logoutCustomer());

    await authApi.logout();

    Cookies.remove("token");

    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: (
        <Link to="/profile">
          <CustomText size={"12px"} weight={"400"} color={"var(--gray-dark)"}>
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{
                marginRight: "8px",
              }}
            />
            Profile
          </CustomText>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link to="/room/bookings">
          <CustomText size={"12px"} weight={"400"} color={"var(--gray-dark)"}>
            <FontAwesomeIcon
              icon={faHotel}
              style={{
                marginRight: "8px",
              }}
            />
            Room Bookings
          </CustomText>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link to="/tour/bookings">
          <CustomText size={"12px"} weight={"400"} color={"var(--gray-dark)"}>
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              style={{
                marginRight: "8px",
              }}
            />
            Tour Bookings
          </CustomText>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <CustomText
          size={"12px"}
          weight={"400"}
          color={"var(--gray-dark)"}
          onClick={handleLogout}
        >
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            style={{
              marginRight: "8px",
            }}
          />
          Logout
        </CustomText>
      ),
    },
  ];

  return (
    <Row
      style={{
        width: "100%",
        height: "110px",
        position: "fixed",
        zIndex: "999",
      }}
    >
      {/* Row top */}
      <Row
        style={{
          width: "100%",
          height: "30px",
          background: "white",
          borderBottom: "2px solid var(--bg-gray-light)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "white",
          }}
          justify={"space-between"}
        >
          <Col
            xxl={12}
            xl={12}
            lg={12}
            md={24}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <CustomText
              size={"12px"}
              weight={"600"}
              color={"var(--black-text)"}
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
          </Col>

          <Col
            xxl={12}
            xl={12}
            lg={12}
            md={24}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {sub ? (
              <>
                <Dropdown menu={{ items }} placement="bottomRight">
                  <Button
                    style={{
                      border: "0",
                      padding: "0",
                    }}
                  >
                    <CustomText
                      size={"12px"}
                      weight={"600"}
                      color={"var(--black-text)"}
                    >
                      Hello, {sub}
                    </CustomText>
                  </Button>
                </Dropdown>
              </>
            ) : (
              <>
                <CustomText
                  size={"12px"}
                  weight={"600"}
                  color={"var(--black-text)"}
                  link={"/login"}
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  Sign In
                </CustomText>

                <CustomText
                  size={"11px"}
                  weight={"600"}
                  color={"var(--black-text)"}
                  link={"/register"}
                >
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  Register
                </CustomText>
              </>
            )}
          </Col>
        </Row>
      </Row>

      {/* Row bottom */}
      <Row
        style={{
          width: "100%",
          height: "80px",
          background: "white",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "white",
          }}
          justify={"space-between"}
        >
          {/* Logo */}
          <Col
            xxl={8}
            xl={8}
            lg={8}
            md={24}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Link to="/">
              <Image
                src={websiteInfo?.logo || logo}
                preview={false}
                style={{
                  width: "100%",
                  height:
                    screens.xxl || screens.xl || screens.lg ? "34px" : "24px",
                  objectFit: "contain",
                }}
              />
            </Link>
          </Col>

          {/* Navigation */}
          <Col
            xxl={8}
            xl={8}
            lg={8}
            md={24}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Col>
              <Menu
                mode="horizontal"
                items={navigations}
                style={{
                  gap: "10px",
                }}
              />
            </Col>
          </Col>

          {/* Search and cart */}
          <Col
            xxl={8}
            xl={8}
            lg={8}
            md={24}
            sm={24}
            xs={24}
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CustomText size={"19px"} weight={"600"} color={"var(--gray-text)"}>
              <FontAwesomeIcon
                icon={faSearch}
                onClick={handleShowSearchBlog}
                style={{ cursor: "pointer" }}
              />
            </CustomText>

            <Modal
              open={isSearchBlogOpen}
              onOk={handleSearchBlog}
              onCancel={handleCancelSearchBlog}
              centered={true}
              footer={false}
            >
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                <Form.Item>
                  <CustomText
                    size={"18px"}
                    weight={"600"}
                    color={"var(--gray-text)"}
                    isButton={true}
                  >
                    Search Blogs Quickly
                  </CustomText>
                </Form.Item>

                <Row
                  style={{
                    width: "100%",
                  }}
                  justify={"space-between"}
                  align={"middle"} // Center items vertically if needed
                >
                  <Controller
                    name="search"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                        style={{
                          flex: 1,
                          margin: 0,
                        }}
                      >
                        <Input
                          prefix={<SearchOutlined />}
                          {...field}
                          placeholder="Enter title or hash tags"
                          style={{
                            width: "100%",
                          }}
                        />
                      </Form.Item>
                    )}
                  />
                  <Button
                    htmlType="submit"
                    size="large"
                    className="hover-button"
                    style={{
                      background: "var(--green-dark)",
                      color: "var(--white)",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginBottom: "0 !important",
                      marginLeft: "10px",
                    }}
                    icon={loading ? <Spin /> : null}
                    loading={loading}
                  >
                    <CustomText
                      size={"13px"}
                      weight={"700"}
                      color={"var(--white)"}
                      isButton={true}
                    >
                      Search
                    </CustomText>
                  </Button>
                </Row>
              </Form>
            </Modal>

            {/* <Badge count={wishlistCount}> */}
            <CustomText
              size={"21px"}
              weight={"600"}
              color={"var(--gray-text)"}
              link={"/wishlist"}
            >
              <FontAwesomeIcon icon={faHeart} />
            </CustomText>
            {/* </Badge> */}
          </Col>
        </Row>
      </Row>
    </Row>
  );
}
