import {
  faAngleDown,
  faArrowRightFromBracket,
  faBagShopping,
  faPhone,
  faSearch,
  faTrashCan,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Grid, Image, Menu, Badge, Dropdown, Button } from "antd";
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

const { useBreakpoint } = Grid;

export default function Header({ websiteInfo }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sub = useSelector((state) => state.auth?.info?.sub);

  const screens = useBreakpoint();

  const navigations = [
    {
      label: (
        <>
          <CustomText size={"14px"} weight={"600"} color={"var(--black-text)"}>
            Home{" "}
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
      key: "Home",
      // children: [
      //   {
      //     key: "1",
      //     label: "Home version 1",
      //   },
      //   {
      //     key: "2",
      //     label: "Home version 2",
      //   },
      // ],
    },

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
                link={`/tours/list?minPrice=0&maxPrice=5000000&review=`}
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
  ];

  const items = [
    {
      key: "1",
      label: (
        <Link to="/">
          <Row
            style={{
              width: "260px",
            }}
            justify={"space-between"}
          >
            <Col
              xxl={18}
              xl={18}
              lg={18}
              md={18}
              sm={18}
              xs={18}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Image
                src={product}
                preview={false}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <Col
                xxl={24}
                xl={24}
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <CustomText
                  size={"13px"}
                  weight={"500"}
                  color={"var(--black-text)"}
                >
                  Product 1
                </CustomText>
                <CustomText
                  size={"12px"}
                  weight={"400"}
                  color={"var(--gray-dark)"}
                >
                  1 x 36$
                </CustomText>
              </Col>
            </Col>

            <Col
              xxl={4}
              xl={4}
              lg={4}
              md={4}
              sm={4}
              xs={4}
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "start",
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{
                  color: "var(--gray-light)",
                }}
              />
            </Col>
          </Row>
        </Link>
      ),
    },

    {
      key: "2",
      label: (
        <Link to="/">
          <Row
            style={{
              width: "260px",
            }}
            justify={"space-between"}
          >
            <Col
              xxl={18}
              xl={18}
              lg={18}
              md={18}
              sm={18}
              xs={18}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Image
                src={product}
                preview={false}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <Col
                xxl={24}
                xl={24}
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <CustomText
                  size={"13px"}
                  weight={"500"}
                  color={"var(--black-text)"}
                >
                  Product 1
                </CustomText>
                <CustomText
                  size={"12px"}
                  weight={"400"}
                  color={"var(--gray-dark)"}
                >
                  1 x 36$
                </CustomText>
              </Col>
            </Col>

            <Col
              xxl={4}
              xl={4}
              lg={4}
              md={4}
              sm={4}
              xs={4}
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "start",
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{
                  color: "var(--gray-light)",
                }}
              />
            </Col>
          </Row>
        </Link>
      ),
    },

    {
      key: "3",
      label: (
        <Link to="/">
          <Row
            style={{
              width: "260px",
              border: "1p solid var(--gray-light)",
            }}
            justify={"space-between"}
          >
            <Col
              xxl={18}
              xl={18}
              lg={18}
              md={18}
              sm={18}
              xs={18}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Image
                src={product}
                preview={false}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
              <Col
                xxl={24}
                xl={24}
                lg={24}
                md={24}
                sm={24}
                xs={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <CustomText
                  size={"13px"}
                  weight={"500"}
                  color={"var(--black-text)"}
                >
                  Product 1
                </CustomText>
                <CustomText
                  size={"12px"}
                  weight={"400"}
                  color={"var(--gray-dark)"}
                >
                  1 x 36$
                </CustomText>
              </Col>
            </Col>

            <Col
              xxl={4}
              xl={4}
              lg={4}
              md={4}
              sm={4}
              xs={4}
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "start",
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                style={{
                  color: "var(--gray-light)",
                }}
              />
            </Col>
          </Row>
        </Link>
      ),
    },

    {
      key: "4",
      label: (
        <Row
          style={{
            width: "260px",
            height: "40px",
            border: "1p solid var(--gray-light)",
          }}
          justify={"space-between"}
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
              justifyContent: "end",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <CustomText size={"14px"} weight={"400"} color={"var(--gray-dark)"}>
              Total:
            </CustomText>
            <CustomText
              size={"16px"}
              weight={"600"}
              color={"var(--black-text)"}
            >
              120.00$
            </CustomText>
          </Col>
        </Row>
      ),
    },

    {
      key: "5",
      label: (
        <Row
          style={{
            width: "260px",
            height: "40px",
            border: "1p solid var(--gray-light)",
          }}
          justify={"space-between"}
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button>
              <CustomText size={"12px"} weight={"600"} color={"var(--red)"}>
                GO TO CART
              </CustomText>
            </Button>

            <Button>
              <CustomText size={"12px"} weight={"600"} color={"var(--red)"}>
                CHECKOUT
              </CustomText>
            </Button>
          </Col>
        </Row>
      ),
    },
  ];

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(logoutCustomer());

    await authApi.logout();

    Cookies.remove("token");

    navigate("/login");
  };

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
            >
              <FontAwesomeIcon
                icon={faPhone}
                style={{
                  marginRight: "3px",
                }}
              />
              {websiteInfo?.phone || "0045 043204434"}
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
                <CustomText
                  size={"12px"}
                  weight={"600"}
                  color={"var(--black-text)"}
                  // link={"/login"}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  {sub}
                </CustomText>

                <CustomText
                  size={"12px"}
                  weight={"600"}
                  color={"var(--black-text)"}
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  Logout
                </CustomText>
              </>
            ) : (
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
            )}

            {/* <CustomText
              size={"11px"}
              weight={"600"}
              color={"var(--black-text)"}
              link={"/withlist"}
            >
              <FontAwesomeIcon
                icon={faHeart}
                style={{
                  marginRight: "3px",
                }}
              />
              Withlist
            </CustomText> */}

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
              <FontAwesomeIcon icon={faSearch} />
            </CustomText>

            {/* <Dropdown
              menu={{
                items,
              }}
              placement="bottomRight"
              arrow
            >
              <Badge count={7}>
                <CustomText
                  size={"19px"}
                  weight={"600"}
                  color={"var(--gray-text)"}
                >
                  <FontAwesomeIcon icon={faBagShopping} />
                </CustomText>
              </Badge>
            </Dropdown> */}

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
