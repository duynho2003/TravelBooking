import { useEffect, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Image, Layout, Menu, Row } from "antd";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  faBlog,
  faCreditCard,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import CustomText from "../components/common/CustomText";
import logoAdmin from "../assets/images/logo-admin.png";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../services/auth/AuthApi";
import { initInfoBeforeReload } from "../features/auth/AuthSlice";

const { Sider, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const sub = useSelector((state) => state.auth?.info?.sub);
  const blogId = useSelector((state) => state.blogs?.selectedBlog?.id);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await authApi.logout();

    Cookies.remove("token");

    navigate("/login");
  };

  // Redux State
  const dispatch = useDispatch();

  // useEffect loading info data
  useEffect(() => {
    dispatch(initInfoBeforeReload());
  }, [dispatch]);

  const itemss = [
    {
      key: "/staff/bookings",
      icon: <FontAwesomeIcon icon={faCreditCard} />,
      label: "Bookings",
      children: [
        {
          key: "/staff/bookings/tour/view",
          label: <Link to="/staff/bookings/tour/view">View tour bookings</Link>,
          path: "/staff/bookings/tour/view",
        },
        {
          key: "/staff/bookings/hotel/view",
          label: (
            <Link to="/staff/bookings/hotel/view">View room bookings</Link>
          ),
          path: "/staff/bookings/hotel/view",
        },
      ],
    },

    {
      key: "/staff/transactions",
      icon: <FontAwesomeIcon icon={faMoneyBill1} />,
      label: "Transactions",
      children: [
        {
          key: "/staff/transactions/view",
          label: <Link to="/staff/transactions/view">View transactions</Link>,
          path: "/staff/transactions/view",
        },
      ],
    },

    {
      key: "/staff/blogs",
      icon: <FontAwesomeIcon icon={faBlog} />,
      label: "Blogs",
      children: [
        {
          key: "/staff/blogs/view",
          label: <Link to="/staff/blogs/view">View blogs</Link>,
          path: "/staff/blogs/view",
        },
        // {
        //   key: `/staff/blogs/view/${blogId}`,
        //   label: "View a blog",
        //   path: `/staff/blogs/view/${blogId}`,
        // },
        {
          key: "/staff/blogs/create",
          label: <Link to="/staff/blogs/create">Create new blog</Link>,
          path: "/staff/blogs/create",
        },
        // {
        //   key: `/staff/blogs/update/${blogId}`,
        //   label: "Update blog",
        //   path: `/staff/blogs/update/${blogId}`,
        // },
      ],
    },
  ];

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "100vh",
        }}
        justify={"space-evely"}
      >
        <Col
          style={{
            background: "var(--sider)",
            display: "flex",
            justifyContent: "center",
            width: "240px",
            height: "100vh",
            overflow: "auto",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 11,
          }}
        >
          <Sider
            // collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={"100%"}
          >
            <Link to="/staff/bookings/tour/view">
              <Button
                style={{
                  width: "100%",
                  height: "64px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "var(--blue-dark)",
                  color: "var(--white)",
                  border: "none",
                  fontWeight: "600",
                  borderBottom: "1px solid var(--gray-dark)",
                  borderRadius: "0",
                }}
              >
                <Image
                  src={logoAdmin}
                  preview={false}
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"700"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  DASHBOARD
                </CustomText>
              </Button>
            </Link>

            <Menu
              selectedKeys={[location.pathname]}
              defaultOpenKeys={[
                location.pathname.substring(
                  0,
                  location.pathname.lastIndexOf("/")
                ),
              ]}
              mode="inline"
              theme={"dark"}
              items={itemss}
            />
          </Sider>
        </Col>

        <Col
          style={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: "10px",
            background: "var(--green-dark)",
            width: "calc(100% - 240px)",
            height: "64px",
            padding: "0 20px",
            overflow: "auto",
            position: "fixed",
            top: 0,
            left: 240,
            zIndex: 12,
          }}
        >
          <CustomText
            size={"15px"}
            weight={"500"}
            color={"var(--white)"}
            isButton={true}
          >
            Welcome, {sub?.toUpperCase()}
          </CustomText>
          <Avatar size="large" icon={<UserOutlined />} />

          <Button
            style={{
              background: "var(--bg-admin)",
              border: "var(--green-dark)",
            }}
            onClick={handleLogout}
          >
            <CustomText
              size={"14px"}
              weight={"500"}
              color={"var(--green-dark)"}
              isButton={true}
            >
              Logout
            </CustomText>
          </Button>
        </Col>

        <Col
          style={{
            width: "100%",
            height: "100vh",
            border: "1px solid green",
            overflow: "auto",
            paddingLeft: "240px",
            paddingTop: "64px",
            background: "var( --bg-admin)",
          }}
        >
          <Content
            style={{
              padding: "20px",
              minHeight: 280,
              background: "var( --bg-admin)",
              height: "auto",
            }}
          >
            <Outlet />
          </Content>
        </Col>
      </Row>
    </>
  );
}
