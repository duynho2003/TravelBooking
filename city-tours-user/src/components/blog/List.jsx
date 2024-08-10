import {
  Col,
  Row,
  Grid,
  Breadcrumb,
  Button,
  Rate,
  Slider,
  Radio,
  Space,
  Image,
  Pagination,
  Tag,
} from "antd";
import CustomText from "../common/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faVolumeHigh,
  faFilter,
  faBlenderPhone,
  faMap,
  faTruckPlane,
  faUser,
  faChild,
  faPersonBreastfeeding,
  faWifi,
  faDumbbell,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import badgeSave from "../../assets/images/badge_save.png";
import { Link } from "react-router-dom";
dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function List({
  blogs,
  totalPages,
  currentPage,
  pagination,
  handleTableChange,
}) {
  // Ant Design
  const screens = useBreakpoint();

  const onChangePanigation = (page) => {
    handleTableChange(page, pagination.limit, pagination.search);
  };

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
                      link={"/blogs/list?page=1&limit=4&search="}
                    >
                      Blogs List
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
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px 0",
          }}
          gutter={[20, 20]}
        >
          {/* Col blogs list */}

          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <Col key={blog?.id} span={12}>
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
                    }}
                  >
                    <Link to={`/blogs/${blog?.id}`}>
                      <Image
                        src={blog.thumbnail}
                        preview={false}
                        width={"100%"}
                        style={{
                          height: "200px",
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
                      height: "100%",
                      padding: "20px",
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

                    {/* Hash tags */}
                    <Col
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
                        color={"var(--green-dark)"}
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
              <Pagination
                pageSize={pagination.limit}
                current={currentPage}
                total={totalPages}
                onChange={onChangePanigation}
              />
            </Col>
          )}
        </Row>
      </Row>
    </>
  );
}
