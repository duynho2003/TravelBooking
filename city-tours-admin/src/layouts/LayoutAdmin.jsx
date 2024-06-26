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
  faHotel,
  faLaptop,
  faMoneyBill1,
  faPlaneDeparture,
  faUsersRectangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import CustomText from "../components/common/CustomText";
import logoAdmin from "../assets/images/logo-admin.png";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../services/auth/AuthApi";
import { initInfoBeforeReload } from "../features/auth/AuthSlice";

const { Sider, Content } = Layout;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  const sub = useSelector((state) => state.auth?.info?.sub);
  const tourId = useSelector((state) => state.tours?.selectedTour?.id);
  const hotelId = useSelector((state) => state.hotels?.selectedHotel?.id);

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
      key: "/admin/website/view",
      icon: <FontAwesomeIcon icon={faLaptop} />,
      label: "Website",
      children: [
        {
          key: "/admin/website/view",
          label: <Link to="/admin/website/view">View info</Link>,
          path: "/admin/website/view",
        },
        {
          key: "/admin/website/update",
          label: <Link to="/admin/website/update">Update info</Link>,
          path: "/admin/website/update",
        },
      ],
    },

    {
      key: "/admin/users",
      icon: <FontAwesomeIcon icon={faUsersRectangle} />,
      label: "Users",
      children: [
        {
          key: "/admin/users/view",
          label: <Link to="/admin/users/view">View users</Link>,
          path: "/admin/users/view",
        },
        {
          key: "/admin/users/create",
          label: <Link to="/admin/users/create">Create new user</Link>,
          path: "/admin/users/create",
        },
        {
          key: `/admin/users/update/${userId}`,
          label: "Update user",
          path: `/admin/users/update/${userId}`,
          // disabled: true,
        },
      ],
    },

    {
      key: "/admin/tours",
      icon: <FontAwesomeIcon icon={faPlaneDeparture} />,
      label: "Tours",
      children: [
        {
          key: "/admin/tours/view",
          label: <Link to="/admin/tours/view">View tours</Link>,
          path: "/admin/tours/view",
        },
        {
          key: `/admin/tours/view/${tourId}`,
          label: "View a tour",
          path: `/admin/tours/view/${tourId}`,
        },
        {
          key: "/admin/tours/create",
          label: <Link to="/admin/tours/create">Create new tour</Link>,
          path: "/admin/tours/create",
        },
        {
          key: `/admin/tours/update/${tourId}`,
          label: "Update tour",
          path: `/admin/tours/update/${tourId}`,
        },
      ],
    },

    {
      key: "/admin/hotels",
      icon: <FontAwesomeIcon icon={faHotel} />,
      label: "Hotels",
      children: [
        {
          key: "/admin/hotels/view",
          label: <Link to="/admin/hotels/view">View hotels</Link>,
          path: "/admin/hotels/view",
        },
        {
          key: `/admin/hotels/view/${hotelId}`,
          label: "View a hotel",
          path: `/admin/hotels/view/${hotelId}`,
        },
        {
          key: "/admin/hotels/create",
          label: <Link to="/admin/hotels/create">Create new hotel</Link>,
          path: "/admin/hotels/create",
        },
        {
          key: `/admin/hotels/update/${hotelId}`,
          label: "Update hotel",
          key: `/admin/hotels/update/${hotelId}`,
        },
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
            <Link to="/admin/website/view">
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
