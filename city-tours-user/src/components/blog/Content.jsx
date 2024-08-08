import { Col, Row, Grid, Breadcrumb, Select, Image, Button, Tag } from "antd";
import CustomText from "../common/CustomText";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch } from "react-redux";
dayjs.extend(customParseFormat);
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const { useBreakpoint } = Grid;

export default function Content({ blogs, blog }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const sub = useSelector((state) => state.auth?.info?.sub);

  const sanitizedHTML = DOMPurify.sanitize(blog?.content);

  // Ant Design
  const screens = useBreakpoint();

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "auto",
          background: "white",
          padding: "0",
          borderBottom: "1px solid var(--border)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "white",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "auto",
              padding: "12px 0",
              background: "white",
            }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/"}
                    >
                      <FontAwesomeIcon icon={faLocationDot} /> Home
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/blogs"}
                    >
                      Blog
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                    >
                      {blog?.title}
                    </CustomText>
                  ),
                },
              ]}
            />
          </Row>
        </Row>
      </Row>

      <Row
        style={{
          width: "100%",
          height: "auto",
          background: "var(--bg-gray-light)",
          padding: "0",
        }}
        justify={"center"}
      >
        <Row
          gutter={20}
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px 0",
          }}
        >
          {/* Col content */}
          <Col span={14}>
            {/* Title */}
            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"24px"}
                  weight={"700"}
                  color={"var(--gray-text)"}
                >
                  {blog?.title}
                </CustomText>
              </Col>
            </Row>

            {/* Hash tags */}
            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={24}
                style={{
                  marginBottom: "10px",
                }}
              >
                <CustomText
                  size={"12px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                >
                  Hash tags:
                </CustomText>{" "}
                {blog?.hashTags?.split(", ")?.map((tag, index) => (
                  <Tag key={index} color="var(--pink)">
                    <CustomText
                      size={"12px"}
                      weight={"400"}
                      color={"var(--white)"}
                    >
                      {tag}
                    </CustomText>
                  </Tag>
                ))}
              </Col>
            </Row>

            {/* Description */}
            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={24}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                  isItalic={true}
                >
                  {blog?.description}
                </CustomText>
              </Col>
            </Row>

            {/* Created At */}
            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faClock}
                  style={{
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"14px"}
                  weight={"600"}
                  color={"var(--green-dark)"}
                >
                  {formatDateTime(blog?.createdAt)}
                </CustomText>
              </Col>
            </Row>

            {/* Content */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={24}
                style={{
                  padding: "10px 0",
                }}
              >
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHTML,
                  }}
                />
              </Col>
            </Row>
          </Col>

          {/* Col other blog */}
          <Col
            span={10}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Row
              style={{
                width: "100%",
              }}
            >
              <Col
                span={24}
                style={{
                  background: "var(--gray-mid)",
                  padding: "10px 20px",
                  textAlign: "center",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  marginBottom: "20px",
                }}
              >
                <CustomText size={"22px"} weight={"600"} color={"var(--white)"}>
                  Other Blog
                </CustomText>
              </Col>

              <Col span={24}>
                {blogs && blogs.length > 0 ? (
                  blogs?.map((blog) => (
                    <Col
                      key={blog?.id}
                      span={24}
                      style={{
                        height: "auto",
                        marginBottom: "10px",
                      }}
                    >
                      <Row
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {/* Thumbnail */}
                        <Col
                          span={10}
                          style={{
                            position: "relative",
                            overflow: "hidden",
                            height: "auto",
                          }}
                        >
                          <Link
                            to={`/blogs/${blog?.id}`}
                            style={{
                              height: "100%",
                            }}
                          >
                            <Image
                              src={blog.thumbnail}
                              preview={false}
                              width={"100%"}
                              style={{
                                height: "160px",
                                objectFit: "cover",
                                transition: "transform 0.3s ease-in-out",
                              }}
                              className="image-hover-zoom"
                            />
                          </Link>
                        </Col>

                        {/* Content */}
                        <Col
                          span={14}
                          style={{
                            height: "160px",
                            padding: "15px",
                            background: "var(--white)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {/* Title */}
                          <Col
                            span={24}
                            style={{
                              marginBottom: "10px",
                            }}
                            className="truncated-title"
                          >
                            <CustomText
                              size={"16px"}
                              weight={"500"}
                              color={"var(--gray-text)"}
                              link={`/blogs/${blog?.id}`}
                            >
                              {blog?.title}
                            </CustomText>
                          </Col>

                          {/* Description */}
                          <Col
                            span={24}
                            style={{
                              marginBottom: "10px",
                            }}
                            className="truncated-content"
                          >
                            <CustomText
                              size={"12px"}
                              weight={"400"}
                              color={"var(--gray-text)"}
                            >
                              {blog?.description}
                            </CustomText>
                          </Col>

                          {/* Created At */}
                          <Col
                            span={24}
                            style={{
                              display: "flex",
                              justifyContent: "start",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faClock}
                              style={{
                                color: "var(--gray-light)",
                              }}
                            />
                            <CustomText
                              size={"13px"}
                              weight={"600"}
                              color={"var(--pink)"}
                            >
                              {formatDateTime(blog?.createdAt)}
                            </CustomText>
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  ))
                ) : (
                  <Col
                    span={24}
                    style={{
                      padding: "10px 0",
                      textAlign: "center",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      No blog found
                    </CustomText>
                  </Col>
                )}

                {blogs && blogs.length > 0 && (
                  <Col
                    span={24}
                    style={{
                      padding: "10px 0",
                      textAlign: "center",
                    }}
                  >
                    <Button
                      size="large"
                      style={{
                        background: "var(--white)",
                        border: "2px solid var(--green-dark)",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      <CustomText
                        size={"14px"}
                        weight={"600"}
                        color={"var(--green-dark)"}
                        isButton={true}
                        link={`/blogs/list?search=`}
                      >
                        View all Blogs
                      </CustomText>
                    </Button>
                  </Col>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
}
