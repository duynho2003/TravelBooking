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
import bgLogin from "../assets/images/bg-login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { HeatMapOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import CustomText from "../components/common/CustomText";

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function Login() {
  // Hook form
  const { control, handleSubmit } = useForm({});
  const screens = useBreakpoint();

  // Redux state
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);

  // Handle event
  const onSubmit = async (data) => {
    console.log(data);
    // setLoading(true);
    // try {
    //   const action = await dispatch(register(data));

    //   console.log("action: ", action);

    //   if (register.fulfilled.match(action)) {
    //     if (action?.payload?.data) {
    //       notification.success({
    //         message: "Đăng ký thành công",
    //         description: "Đăng ký tài khoản thành công.",
    //       });
    //       navigate("/login");
    //     } else {
    //       const error = action?.payload?.error.message || "Lỗi không xác định.";
    //       notification.error({
    //         message: "Lỗi đăng nhập",
    //         description: error,
    //       });
    //     }
    //   } else if (register.rejected.match(action)) {
    //     const error = action?.payload?.error.message || "Lỗi không xác định.";
    //     notification.error({
    //       message: "Lỗi đăng nhập",
    //       description: error,
    //     });
    //   }
    // } catch (error) {
    //   notification.error({
    //     message: "Lỗi hệ thống",
    //     description:
    //       "Máy chủ không thực hiện được yêu cầu hợp lệ do lỗi với máy chủ.",
    //   });
    // } finally {
    //   setLoading(false);
    // }
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
          backgroundImage: `url(${bgLogin})`,
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
              name="username"
              control={control}
              rules={{ required: "Username is required." }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Username"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input {...field} placeholder="Username" />
                </Form.Item>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required." }}
              render={({ field, fieldState: { error } }) => (
                <Form.Item
                  label="Password"
                  validateStatus={error ? "error" : ""}
                  help={error?.message}
                >
                  <Input
                    {...field}
                    placeholder="Password"
                    onChange={(e) => {
                      field.onChange(e.target.value.trim());
                    }}
                  />
                </Form.Item>
              )}
            />

            <Form.Item>
              <CustomText
                size={"14px"}
                weight={"400"}
                color={"var(--pink)"}
                link={"/"}
              >
                Forgot Password?
              </CustomText>
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                className="hover-button"
                style={{
                  background: "var(--green-dark)",
                  color: "var(--white)",
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
                  SIGN IN
                </CustomText>
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                size="large"
                style={{
                  background: "var(--white)",
                  border: "2px solid var(--green-dark)",
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
                  color={"var(--green-dark)"}
                  link={"/register"}
                  isButton={true}
                >
                  REGISTER
                </CustomText>
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
