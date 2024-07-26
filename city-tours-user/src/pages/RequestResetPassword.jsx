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

export default function RequestResetPassword() {
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
        `http://localhost:5050/api/v1/auth/request-password-reset`,
        { email: data.email }
      );

      console.log("response: ", response);

      if (response?.data?.status === 200) {
        notification.success({
          message: "Success",
          description:
            "A password reset email has been sent to your email address.",
        });
      } else {
        notification.warning({
          message: "Warning",
          description:
            "There was an issue sending the password reset email. Please try again later.",
        });
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
              name="email"
              control={control}
              rules={{ required: "Email is required." }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Email"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input
                    {...field}
                    placeholder="Enter email"
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
                  REQUEST RESET PASSWORD
                </CustomText>
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
