import {
  Col,
  Row,
  Grid,
  Breadcrumb,
  Button,
  Rate,
  Avatar,
  DatePicker,
  TimePicker,
  Timeline,
  Input,
  Table,
  Form,
  Collapse,
  Image,
  InputNumber,
  notification,
  Spin,
  Tooltip,
} from "antd";
import category1 from "../../assets/images/category-1.jpg";
import category2 from "../../assets/images/category-2.jpg";
import category3 from "../../assets/images/category-3.png";
import CustomText from "../common/CustomText";
import { Link, useLocation, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChild,
  faDog,
  faHotel,
  faLocationDot,
  faPersonBreastfeeding,
  faPhone,
  faPhoneVolume,
  faVolumeHigh,
  faWheelchair,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  faHeart,
  faCalendar,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  EditOutlined,
  FrownOutlined,
  InfoCircleOutlined,
  MehOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Radio, Space } from "antd";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { getTourById } from "../../features/tour/TourSlice";
import { useEffect, useState } from "react";
import logoVNPay from "../../assets/images/logo-vnpay.webp";
import logoMomo from "../../assets/images/logo-momo.png";
import logoZalopay from "../../assets/images/logo-zalopay.webp";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import {
  createCustomer,
  getInfoCustomer,
  updateCustomer,
} from "../../features/customer/CustomerSlice";

dayjs.extend(customParseFormat);

const { useBreakpoint } = Grid;

export default function Detail() {
  const customer = useSelector((state) => state.customer?.info);

  // Redux state
  const dispatch = useDispatch();

  // Local state
  const [loading, setLoading] = useState(false);

  // Ant Design
  const screens = useBreakpoint();

  const { control, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (customer) {
      reset({
        username: customer?.username,
        email: customer?.email,
        name: customer?.customer?.name,
        phone: customer?.customer?.phone,
        address: customer?.customer?.address,
        status: customer?.status,
      });
    }
  }, [customer]);

  const handleCreateProfile = async (data) => {
    const newData = {
      userId: customer.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    console.log("newData: ", newData);

    setLoading(true);

    try {
      const action = await dispatch(createCustomer(newData));

      console.log("action: ", action);

      if (createCustomer.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Profile Updated",
            description: "Profile information updated successfully.",
          });

          dispatch(getInfoCustomer(customer.id));
        } else {
          const error = action?.payload?.error.message || "Unknown error";
          notification.error({
            message: "Update Error",
            description: error,
          });
        }
      } else if (createCustomer.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Update Error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System error",
        description:
          "The server couldn't fulfill a valid request due to an issue with the server.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    const newData = {
      userId: customer.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
    };

    console.log("newData: ", newData);

    setLoading(true);

    try {
      const action = await dispatch(updateCustomer(newData));

      console.log("action: ", action);

      if (updateCustomer.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Profile Updated",
            description: "Profile information updated successfully.",
          });
          dispatch(getInfoCustomer(customer.id));
        } else {
          const error = action?.payload?.error.message || "Unknown error";
          notification.error({
            message: "Update Error",
            description: error,
          });
        }
      } else if (updateCustomer.rejected.match(action)) {
        const error = action?.payload?.error.message || "Unknown error";
        notification.error({
          message: "Update Error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System error",
        description:
          "The server couldn't fulfill a valid request due to an issue with the server.",
      });
    } finally {
      setLoading(false);
    }
  };

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
                      link={"/tours"}
                    >
                      Profile
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
          padding: "40px 0",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            padding: "40px",
            background: "var(--white)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
          }}
        >
          {/* Col avatar */}
          <Col
            span={7}
            style={{
              paddingTop: "5px",
            }}
          >
            <Row
              style={{
                width: "100%",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Avatar shape="square" icon={<UserOutlined />} size={250} />
              </Col>
            </Row>
          </Col>

          {/* Col profile */}
          <Col span={17}>
            {/* Your details */}
            <Row
              style={{
                width: "100%",
              }}
            >
              <Row
                style={{
                  width: "100%",
                }}
              >
                <Form
                  onFinish={handleSubmit((data) => {
                    // Check if phone, address, and status are empty
                    if (
                      !customer?.customer?.name &&
                      !customer?.customer?.phone &&
                      !customer?.customer?.address
                    ) {
                      handleCreateProfile(data); // Call create profile function
                    } else {
                      handleUpdateProfile(data); // Call update profile function
                    }
                  })}
                  layout="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"space-between"}
                  >
                    <Col span={11}>
                      <Controller
                        name="username"
                        control={control}
                        rules={{ required: "Username is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Username"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input {...field} readOnly />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={11}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{ required: "Email is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Email"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input {...field} readOnly />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={11}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Name"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input
                              {...field}
                              size="small"
                              placeholder="Not update"
                              suffix={
                                <Tooltip title="Can edit information">
                                  <EditOutlined
                                    style={{
                                      color: "rgba(0,0,0,.45)",
                                    }}
                                  />
                                </Tooltip>
                              }
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={11}>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "Phone is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Phone"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input
                              {...field}
                              size="small"
                              placeholder="Not update"
                              suffix={
                                <Tooltip title="Can edit information">
                                  <EditOutlined
                                    style={{
                                      color: "rgba(0,0,0,.45)",
                                    }}
                                  />
                                </Tooltip>
                              }
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={11}>
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: "Address is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Address"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input
                              {...field}
                              size="small"
                              placeholder="Not update"
                              suffix={
                                <Tooltip title="Can edit information">
                                  <EditOutlined
                                    style={{
                                      color: "rgba(0,0,0,.45)",
                                    }}
                                  />
                                </Tooltip>
                              }
                            />
                          </Form.Item>
                        )}
                      />
                    </Col>

                    <Col span={11}>
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field, fieldState: { error } }) => (
                          <Form.Item
                            label="Status"
                            validateStatus={error ? "error" : ""}
                            help={error?.message}
                          >
                            <Input {...field} readOnly />
                          </Form.Item>
                        )}
                      />
                    </Col>
                  </Row>

                  <Row
                    style={{
                      width: "100%",
                    }}
                    justify={"end"}
                  >
                    <Col span={11}>
                      <Button
                        htmlType="submit"
                        size="large"
                        className="hover-button"
                        style={{
                          width: "100%",
                          background: "var(--green-dark)",
                          border: "var(--green-dark)",
                          color: "var(--white)",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                        icon={loading ? <Spin /> : null}
                        loading={loading}
                      >
                        <CustomText
                          size={"14px"}
                          weight={"600"}
                          color={"var(--white)"}
                          isButton={true}
                          isUppercase={true}
                        >
                          Save
                        </CustomText>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
}
