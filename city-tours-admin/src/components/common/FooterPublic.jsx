import {
  Grid,
  Col,
  Row,
  Card,
  Image,
  Avatar,
  Typography,
  Tag,
  Button,
} from "antd";
import styled from "styled-components";
import urlImageCourse1 from "../../assets/images/course1.jpg";
import urlImageCourse2 from "../../assets/images/course2.jpg";
import urlImageCourse3 from "../../assets/images/course3.png";
import urlImageCourse4 from "../../assets/images/course4.jpg";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { HeatMapOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  FacebookOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Meta } = Card;
const { Text, Title } = Typography;

export default function FooterPublic() {
  const screens = useBreakpoint();

  // Styled components
  const CustomContainerFooter = styled.div`
    background-color: var(--white);
    width: 100%;
    height: auto;
    padding: 20px 0;
    line-height: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid var(--border);
  `;

  const CustomCourseFooter = styled.div`
    height: 100%;
    width: ${screens.xxl || screens.xl || screens.lg ? "1280px" : "100%"};
    line-height: 0 !important;
    padding: 0;
  `;

  return (
    <>
      <CustomContainerFooter>
        <CustomCourseFooter>
          <Row justify={"center"}>
            <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
              <Title
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                <Link
                  to="/"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "5px",
                    color: "var(--black)",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  <HeatMapOutlined />
                  Online Courses
                </Link>
              </Title>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Text
                  style={{
                    color: "var(--gray-text)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  Địa chỉ: Hồ Chí Minh
                </Text>

                <Text
                  style={{
                    color: "var(--gray-text)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  Số điện thoại: 099 9999 999
                </Text>

                <Text
                  style={{
                    color: "var(--gray-text)",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  Email: onlinecourses@gmail.com
                </Text>
              </Col>
            </Col>

            <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
              <Title
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                <Link
                  to="/"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "5px",
                    color: "var(--black)",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  Liên kết hữu ích
                </Link>
              </Title>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Text>
                  <Link
                    to="/"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Trang chủ
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Khóa học
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Bài giảng
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Liên hệ
                  </Link>
                </Text>
                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Giới thiệu
                  </Link>
                </Text>
              </Col>
            </Col>

            <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
              <Title
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "20px",
                }}
              >
                <Link
                  to="/"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: "5px",
                    color: "var(--black)",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  Hỗ trợ học viên
                </Link>
              </Title>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Text>
                  <Link
                    to="/"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Chính sách
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Bảo mật
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Điều khoản
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    Quy định
                  </Link>
                </Text>
              </Col>
            </Col>

            <Col xxl={6} xl={6} lg={6} md={12} sm={12} xs={24}>
              <Title
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "20px",
                  textAlign: "right",
                }}
              >
                <Link
                  to="/"
                  style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "5px",
                    color: "var(--black)",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  Kết nối với chúng tôi
                </Link>
              </Title>

              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "end",
                  gap: "10px",
                }}
              >
                <Text>
                  <Link
                    to="/"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    <Tag icon={<TwitterOutlined />} color="#55acee">
                      Twitter
                    </Tag>
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    <Tag icon={<YoutubeOutlined />} color="#cd201f">
                      Youtube
                    </Tag>
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    <Tag icon={<FacebookOutlined />} color="#3b5999">
                      Facebook
                    </Tag>
                  </Link>
                </Text>

                <Text>
                  <Link
                    to="/courses"
                    style={{
                      color: "var(--gray-text)",
                    }}
                  >
                    <Tag icon={<LinkedinOutlined />} color="#55acee">
                      LinkedIn
                    </Tag>
                  </Link>
                </Text>
              </Col>
            </Col>
          </Row>

          <Row
            style={{
              width: "100%",
              marginTop: "20px",
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
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "var(--gray-text)",
                  fontSize: "12px",
                }}
              >
                © 2024 Online Courses. All rights reserved.
              </Text>
            </Col>
          </Row>
        </CustomCourseFooter>
      </CustomContainerFooter>
    </>
  );
}
