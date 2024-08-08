import {
  Col,
  Form,
  Image,
  Row,
  notification,
  Typography,
  Select,
  Input,
  Button,
  Spin,
  Grid,
} from "antd";
import bgRegister from "../assets/images/bg-register.webp";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HeatMapOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import CustomText from "../components/common/CustomText";
import { register } from "../features/auth/AuthSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function ResetPassword() {
  const { token } = useParams();

  console.log("token: ", token);

  // Hook form
  const { getValues, control, handleSubmit } = useForm({});
  const screens = useBreakpoint();

  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);

  // Handle event
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5050/api/v1/auth/update-password`,
        { token: token, newPassword: data.password }
      );

      console.log("response: ", response);

      if (response?.data?.status === 200) {
        notification.success({
          message: "Success",
          description:
            "A password reset email has been sent to your email address.",
        });

        navigate("/login");
      }
    } catch (error) {
      notification.warning({
        message: "Warning",
        description:
          "There was an issue sending the password reset email. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateConfirmPassword = (value) => {
    const password = getValues("password");
    return (
      value === password || "Confirm password does not match with password."
    );
  };

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "110px",
        }}
      ></Row>
      <Row
        style={{
          width: "100%",
          height: "622px",
          backgroundImage: `url(${bgRegister})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Col xs={22} sm={20} md={16} lg={12} xl={7} xxl={7}>
          <Form
            onFinish={handleSubmit(onSubmit)}
            layout="vertical"
            style={{
              background: "var(--white)",
              borderRadius: "5px",
              boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.2)",
              padding: "30px",
              border: "1px solid var(--border)",
            }}
          >
            <Form.Item
              style={{
                textAlign: "center",
              }}
            >
              <Image
                src={logo}
                preview={false}
                style={{
                  width: "100%",
                  height:
                    screens.xxl || screens.xl || screens.lg ? "34px" : "24px",
                  objectFit: "contain",
                }}
              />
            </Form.Item>

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required." }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="New Password"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input.Password
                    {...field}
                    placeholder="Enter new password"
                    onChange={(e) => {
                      field.onChange(e.target.value.trim());
                    }}
                  />
                </Form.Item>
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Confirm password is required.",
                validate: validateConfirmPassword,
              }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Confirm New Password"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input.Password
                    {...field}
                    placeholder="Enter confirm new password"
                    onChange={(e) => {
                      field.onChange(e.target.value.trim());
                    }}
                  />
                </Form.Item>
              )}
            />

            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                className="hover-button"
                style={{
                  background: "var(--green-dark)",
                  color: "var(--white)",
                  marginTop: "20px",
                  width: "100%",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
                icon={loading ? <Spin /> : null}
                loading={loading}
              >
                <CustomText
                  size={"13px"}
                  weight={"700"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  RESET
                </CustomText>
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
