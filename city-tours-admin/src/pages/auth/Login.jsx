import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  notification,
  Spin,
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { login } from "../../features/auth/AuthSlice";

const { Title } = Typography;

function Login() {
  // Hook form
  const { control, handleSubmit } = useForm({});

  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);

  // Handle event
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const action = await dispatch(login(data));

      console.log("action: ", action);

      if (login.fulfilled.match(action)) {
        if (action?.payload?.data) {
          const token = action?.payload?.data?.token;
          Cookies.set("token", token);
          notification.success({
            message: "Đăng nhập thành công",
            description: "Đăng nhập vào hệ thống thành công.",
          });
          navigate("/admin/website/view");
        } else {
          const error = action?.payload?.error.message || "Lỗi không xác định.";
          notification.error({
            message: "Lỗi đăng nhập",
            description: error,
          });
        }
      } else if (login.rejected.match(action)) {
        const error = action?.payload?.error.message || "Lỗi không xác định.";
        notification.error({
          message: "Lỗi đăng nhập",
          description: error,
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description:
          "Máy chủ không thực hiện được yêu cầu hợp lệ do lỗi với máy chủ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      justify="center"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-admin)",
      }}
    >
      <Col xs={22} sm={20} md={16} lg={12} xl={6}>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          style={formStyle}
        >
          <Title
            level={3}
            style={{
              textAlign: "center",
            }}
          >
            Admin Login
          </Title>

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
                <Input
                  {...field}
                  placeholder="Enter your username"
                  onChange={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Password"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input.Password
                  {...field}
                  placeholder="Enter your password"
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
              style={{
                background: "var(--green-dark)",
                color: "var(--white)",
                marginTop: "20px",
                width: "100%",
              }}
              icon={loading ? <Spin /> : null}
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

const formStyle = {
  background: "var(--white)",
  borderRadius: "10px",
  padding: "20px 30px",
  border: "1px solid var(--border)",
};

export default Login;
