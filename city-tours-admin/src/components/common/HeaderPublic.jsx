import {
  Layout,
  Grid,
  Row,
  Col,
  Button,
  Avatar,
  Dropdown,
  Typography,
} from "antd";
import styled from "styled-components";
import { HeatMapOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { getUserById } from "../../features/user/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const items = [
  {
    key: "1",
    label: <Link to="/">Thông tin cá nhân</Link>,
  },
  {
    key: "2",
    label: <Link to="/my-courses">Khóa học của tôi</Link>,
  },
  {
    key: "3",
    label: <Link to="/transactions/deposit">Nạp tiền</Link>,
  },
  {
    key: "4",
    label: <Link to="/transactions/withdraw">Rút tiền</Link>,
  },

  {
    key: "5",
    label: <Link to="/">Đăng xuất</Link>,
  },
];

export default function HeaderPublic() {
  const screens = useBreakpoint();
  const url = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = Cookies.get("token");
  const decode = decodeToken(token);
  const info = decode?.name;
  const userId = decode?.userId;

  const walletBalance = useSelector(
    (state) => state.user?.profile?.walletBalance
  );

  const enrollment = useSelector((state) => state.enrollment?.info);

  useEffect(() => {
    dispatch(getUserById(userId));
  }, [dispatch, userId, enrollment]);

  // Styled components
  const CustomContainerHeader = styled.div`
    background-color: var(--white);
    width: 100%;
    height: 56px;
    line-height: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--border);
    position: fixed;
    z-index: 999;
  `;

  const CustomHeader = styled(Header)`
    background-color: var(--white);
    height: 100%;
    width: ${screens.xxl || screens.xl || screens.lg ? "1280px" : "100%"};
    line-height: 0 !important;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const NavList = styled.ul`
    height: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    gap: ${screens.xxl || screens.xl || screens.lg ? "30px" : "10px"};
    list-style-type: none;
    padding: 0;
  `;

  const Li = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20;
  `;

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <>
      <CustomContainerHeader>
        <CustomHeader>
          <Row
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Col xxl={16} xl={16} lg={16} md={16} sm={12} xs={12}>
              <Row
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Col xxl={7} xl={7} lg={7} md={9} sm={12} xs={12}>
                  <Link
                    to="/"
                    style={{
                      height: "100%",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                      gap: "5px",
                      color: "var(--black-text)",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    <HeatMapOutlined />
                    Online Courses
                  </Link>
                </Col>
                <Col xxl={17} xl={17} lg={17} md={15} sm={12} xs={12}>
                  <NavList>
                    <Li>
                      <Link
                        to="/courses"
                        style={{
                          color:
                            url.pathname === "/courses"
                              ? "var(--black-text)"
                              : "var(--gray-text)",
                          fontWeight:
                            url.pathname === "/courses" ? "600" : "400",
                        }}
                      >
                        Khóa học
                      </Link>
                    </Li>
                    <Li>
                      <Link
                        to="/lectures"
                        style={{
                          color:
                            url.pathname === "/lectures"
                              ? "var(--black-text)"
                              : "var(--gray-text)",
                          fontWeight:
                            url.pathname === "/lectures" ? "600" : "400",
                        }}
                      >
                        Bài giảng
                      </Link>
                    </Li>
                    <Li>
                      <Link
                        to="/"
                        style={{
                          color:
                            url.pathname === "/contact"
                              ? "var(--black-text)"
                              : "var(--gray-text)",
                          fontWeight:
                            url.pathname === "/contact" ? "600" : "400",
                        }}
                      >
                        Liên hệ
                      </Link>
                    </Li>
                    <Li>
                      <Link
                        to="/"
                        style={{
                          color:
                            url.pathname === "/about"
                              ? "var(--black-text)"
                              : "var(--gray-text)",
                          fontWeight: url.pathname === "/about" ? "600" : "400",
                        }}
                      >
                        Giới thiệu
                      </Link>
                    </Li>
                  </NavList>
                </Col>
              </Row>
            </Col>

            <Col xxl={8} xl={8} lg={8} md={8} sm={12} xs={12}>
              <Row
                justify={"end"}
                style={{
                  width: "100%",
                  height: "100%",
                  gap: "10px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
              >
                {info ? (
                  <>
                    <Col
                      // xxl={23}
                      // xl={23}
                      // lg={23}
                      // md={23}
                      // sm={23}
                      // xs={23}
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "var(--black-text)",
                        }}
                      >
                        {info},{" "}
                        {walletBalance
                          ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(walletBalance)
                          : new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(0)}
                      </Text>
                      <Dropdown
                        menu={{
                          items,
                        }}
                        placement="bottomRight"
                      >
                        <Button
                          style={{
                            border: "none",
                          }}
                        >
                          <Avatar size="large" icon={<UserOutlined />} />
                        </Button>
                      </Dropdown>
                      <Button size="small" onClick={handleLogout}>
                        Đăng xuất
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Link to="/register">
                        <Button
                          type="default"
                          size="large"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          Đăng ký
                        </Button>
                      </Link>

                      <Link to="/login">
                        <Button
                          type="primary"
                          size="large"
                          style={{
                            fontSize: "14px",
                            backgroundColor: "var(--blue-light)",
                          }}
                        >
                          Đăng nhập
                        </Button>
                      </Link>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </CustomHeader>
      </CustomContainerHeader>
    </>
  );
}
