import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Table,
  TimePicker,
  Typography,
  Image,
  Button,
  Tag,
  Card,
  Modal,
  InputNumber,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getHotelById, getRoomById } from "../../features/hotel/HotelSlice";
import "../../App.css";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const { Meta } = Card;
const { Text } = Typography;
const { Option } = Select;

const ViewAHotel = () => {
  // Redux State
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const hotel = useSelector((state) => state.hotels?.selectedHotel);
  const selectedRoom = useSelector((state) => state.hotels?.selectedRoom);
  const isLoading = useSelector((state) => state.hotels?.isLoading);
  const error = useSelector((state) => state.hotels?.error);

  // Local State
  const [showContent, setShowContent] = useState(false);
  const [isModalDetailRoom, setIsModalDetailRoom] = useState(false);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getHotelById(hotelId));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  const getTagProps = (bookedStatus) => {
    let color, tagText;

    switch (bookedStatus) {
      case "CANCELLED":
        color = "red";
        tagText = "Cancelled";
        break;
      case "NOT_BOOKED":
        color = "blue";
        tagText = "Not Booked";
        break;
      case "BOOKED":
        color = "green";
        tagText = "Booked";
        break;
      case "ACTIVE":
        color = "cyan";
        tagText = "Active";
        break;
      case "IN_ACTIVE":
        color = "volcano";
        tagText = "Inactive";
        break;
      default:
        color = "default";
        tagText = "Unknown";
        break;
    }

    return { color, tagText };
  };

  const handleShowDetailRoom = (roomId) => {
    setIsModalDetailRoom(true);

    dispatch(getRoomById(roomId));
  };

  const handleOkDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  const handleCancelDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

      {/* Show content */}
      {showContent && (
        <>
          <Row
            style={{
              padding: "20px",
              background: "var( --white)",
              borderRadius: "8px",
            }}
          >
            <Col
              xl={24}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "0 0 20px 0",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Breadcrumb
                items={[
                  {
                    title: (
                      <CustomText
                        size={"18px"}
                        weight={"500"}
                        color={"var(--black-text)"}
                        isButton={true}
                      >
                        View A Hotel - {hotel?.name}
                      </CustomText>
                    ),
                  },
                ]}
              />

              <Button
                style={{
                  background: "var(--green-dark)",
                  border: "var(--green-dark)",
                }}
              >
                <Link to={`/admin/hotels/update/${hotelId}`}>
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Update Hotel
                  </CustomText>
                </Link>
              </Button>
            </Col>
            <Col xl={24}>
              <Form layout="vertical">
                <Row
                  style={{
                    width: "100%",
                  }}
                  justify={"space-between"}
                >
                  <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Name">
                      <Input value={hotel?.name} readOnly />
                    </Form.Item>

                    <Form.Item label="Description">
                      <Input value={hotel?.description} readOnly />
                    </Form.Item>

                    <Form.Item label="Address">
                      <Input value={hotel?.address} readOnly />
                    </Form.Item>

                    <Form.Item label="Active Status">
                      <Tag
                        color={
                          getTagProps(hotel?.activeStatus)?.color || "default"
                        }
                      >
                        {getTagProps(hotel?.activeStatus)?.tagText || "Unknown"}
                      </Tag>
                    </Form.Item>
                  </Col>

                  <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Images">
                      <Row
                        style={{
                          width: "100%",
                        }}
                      >
                        {hotel.thumbnailUrls.map((url, index) => (
                          <Col
                            xxl={6}
                            xl={6}
                            lg={6}
                            key={index}
                            style={{ marginBottom: "10px" }}
                          >
                            <Image
                              src={url}
                              width={"100%"}
                              height={"150px"}
                              style={{
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col xxl={24} xl={24} lg={24}>
              <Col
                xl={24}
                style={{
                  borderBottom: "1px solid var(--border)",
                  padding: "0 0 20px 0",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  items={[
                    {
                      title: (
                        <CustomText
                          size={"18px"}
                          weight={"500"}
                          color={"var(--black-text)"}
                          isButton={true}
                        >
                          Rooms List
                        </CustomText>
                      ),
                    },
                  ]}
                />
              </Col>
              <Row gutter={16}>
                {hotel?.rooms?.map((room) => (
                  <Col span={4}>
                    <Card
                      hoverable
                      bordered={false}
                      style={{
                        border: "1px solid var(--bg-admin)",
                      }}
                    >
                      <Col
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Room no
                        </Text>
                      </Col>

                      <Col
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "30px",
                            fontWeight: 600,
                            color: "var(--green-dark)",
                          }}
                        >
                          {room?.roomNumber}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          textAlign: "center",
                          marginBottom: "10px",
                          paddingBottom: "10px",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: 600,
                            color: "var(--green-dark)",
                          }}
                        >
                          {room?.type}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Tag color="var(--pink)">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(room?.price)}{" "}
                          /per night
                        </Tag>
                      </Col>

                      {/* <Row
                      justify={"space-between"}
                      style={{
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      <Col>
                        <Tag
                          color={
                            getTagProps(room?.bookedStatus)?.color || "default"
                          }
                        >
                          {getTagProps(room?.bookedStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Col>
                      <Col>
                        <Tag
                          color={
                            getTagProps(room?.activeStatus)?.color || "default"
                          }
                        >
                          {getTagProps(room?.activeStatus)?.tagText ||
                            "Unknown"}
                        </Tag>
                      </Col>
                    </Row> */}

                      <Row
                        justify={"center"}
                        style={{
                          width: "100%",
                          marginTop: "20px",
                        }}
                      >
                        {/* <Col>
                        <Link to={`/courses/${1}`}>
                          <Button>Update</Button>
                        </Link>
                      </Col> */}

                        <Col>
                          <Button
                            style={{
                              background: "var(--green-dark)",
                              color: "var(--white)",
                            }}
                            onClick={() => handleShowDetailRoom(room?.id)}
                          >
                            Detail
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))}
                {hotel?.rooms?.length === 0 && (
                  <Col span={24}>
                    <Text style={{ fontSize: "14px", fontWeight: 400 }}>
                      This hotel has no rooms available
                    </Text>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>

          {/* Modal hiển thị chi tiết room */}
          <Modal
            title="Detail room in hotel"
            footer={null}
            open={isModalDetailRoom}
            onOk={handleOkDetailRoom}
            onCancel={handleCancelDetailRoom}
            width={700}
          >
            <Col xs={22} sm={20} md={16} lg={24} xl={24}>
              <Form layout="vertical">
                <Row
                  gutter={16}
                  style={{
                    width: "100%",
                  }}
                >
                  <Col span={12}>
                    <Form.Item label="Room Number">
                      <Input value={selectedRoom?.roomNumber} readOnly />
                    </Form.Item>

                    <Form.Item label="Price / per night">
                      <InputNumber
                        value={selectedRoom?.price}
                        formatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(value)
                        }
                        parser={(value) => value.replace(/[^\d]/g, "")}
                        style={{
                          width: "100%",
                        }}
                        readOnly
                      />
                    </Form.Item>

                    <Form.Item label="Type">
                      <Input value={selectedRoom?.type} readOnly />
                    </Form.Item>

                    <Form.Item label="Booked Status">
                      <Tag
                        color={
                          getTagProps(selectedRoom?.bookedStatus)?.color ||
                          "default"
                        }
                      >
                        {getTagProps(selectedRoom?.bookedStatus)?.tagText ||
                          "Unknown"}
                      </Tag>
                    </Form.Item>

                    <Form.Item label="Active Status">
                      <Tag
                        color={
                          getTagProps(selectedRoom?.activeStatus)?.color ||
                          "default"
                        }
                      >
                        {getTagProps(selectedRoom?.activeStatus)?.tagText ||
                          "Unknown"}
                      </Tag>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Images">
                      <Row
                        gutter={8}
                        style={{
                          width: "100%",
                        }}
                      >
                        {selectedRoom?.imageUrls.map((url, index) => (
                          <Col
                            span={12}
                            key={index}
                            style={{ marginBottom: "10px" }}
                          >
                            <Image
                              src={url}
                              width={"100%"}
                              height={"150px"}
                              style={{
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Modal>
        </>
      )}
    </>
  );
};

export default ViewAHotel;
