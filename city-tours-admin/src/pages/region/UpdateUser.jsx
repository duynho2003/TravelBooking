import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Image,
  Input,
  Row,
  Select,
  Spin,
  notification,
} from "antd";
import { getAccountById, updateAccount } from "../../features/users/UserSlice";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import { userRoles } from "../../utils/enums/UserRoles";
import { userStatus } from "../../utils/enums/UserStatus";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const UpdateUser = () => {
  // Constants
  const DELAY_TIME = 1000;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();
  const user = useSelector((state) => state.users?.selectedUser);
  const isLoading = useSelector((state) => state.users?.isLoading);
  const error = useSelector((state) => state.users?.error);
  const { userId } = useParams();

  console.log("userId: ", userId);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [roles, setRoles] = useState("");
  const [showContent, setShowContent] = useState(false);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getAccountById(userId));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, DELAY_TIME);
    }
  }, []);

  // useEffect for init data
  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        email: user?.email,
        roles: user?.roles?.[0],
        status: user?.status,
      });
    }
  }, [user, reset]);

  // Event Handlers
  const onSubmit = async (data) => {
    console.log(data);

    const newData = {
      userId: userId,
      username: data.username,
      email: data.email,
      roles: [data.roles],
      status: data.status,
    };

    setLoadingButton(true);

    try {
      const action = await dispatch(updateAccount(newData));

      console.log("action: ", action);

      if (updateAccount.fulfilled.match(action)) {
        if (action?.payload?.status === 201) {
          notification.success({
            message: "Update Successful",
            description: "Your account has been successfully updated.",
          });

          dispatch(getAccountById(userId));
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Update Account Error",
            description: error,
          });
        }
      } else if (updateAccount.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Update Account Error",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "System Error",
        description:
          "The server failed to perform a valid request due to an issue with the server.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show content */}
      {showContent && (
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
                      Update User
                    </CustomText>
                  ),
                },
              ]}
            />
          </Col>
          <Col
            xl={24}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Col xxl={8} xl={8} lg={8} md={8} sm={8} xs={8}>
              <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
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
                      <Input {...field} />
                    </Form.Item>
                  )}
                />

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
                      <Input {...field} />
                    </Form.Item>
                  )}
                />

                <Controller
                  name="roles"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item
                      label="Role"
                      validateStatus={error ? "error" : ""}
                      help={error?.message}
                    >
                      <Select
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          setRoles(value);
                        }}
                        placeholder="Choose role"
                      >
                        {userRoles.map((role) => {
                          let label = role;
                          if (role === "ROLE_CUSTOMER") {
                            label = "Customer";
                          } else if (role === "ROLE_STAFF") {
                            label = "Staff";
                          }
                          return (
                            <Option key={role} value={role}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
                />

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
                      <Select
                        {...field}
                        onChange={(value) => {
                          field.onChange(value);
                          setRoles(value);
                        }}
                        placeholder="Choose role"
                      >
                        {userStatus.map((status) => {
                          let label = status;
                          if (status === "ACTIVE") {
                            label = "Active";
                          } else if (status === "IN_ACTIVE") {
                            label = "In Active";
                          }
                          return (
                            <Option key={status} value={status}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  )}
                />

                <Form.Item
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <Button
                    htmlType="submit"
                    style={{
                      background: "var(--pink)",
                      color: "var(--white)",
                      width: "100%",
                    }}
                    icon={loadingButton ? <Spin /> : null}
                    loading={loadingButton}
                  >
                    Save
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UpdateUser;
