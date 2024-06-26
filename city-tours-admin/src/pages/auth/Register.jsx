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
  Select,
} from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../features/auth/AuthSlice";
import { HeatMapOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

function Register() {
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
      const action = await dispatch(register(data));

      console.log("action: ", action);

      if (register.fulfilled.match(action)) {
        if (action?.payload?.data) {
          notification.success({
            message: "Đăng ký thành công",
            description: "Đăng ký tài khoản thành công.",
          });
          navigate("/login");
        } else {
          const error = action?.payload?.error.message || "Lỗi không xác định.";
          notification.error({
            message: "Lỗi đăng nhập",
            description: error,
          });
        }
      } else if (register.rejected.match(action)) {
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

  // Ant Design
  const customizeRequiredMark = (label, required) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );

  return (
    <Row
      justify="center"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Col xs={22} sm={20} md={16} lg={12} xl={6}>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          style={formStyle}
          requiredMark={customizeRequiredMark}
        >
          <Link
            to="/"
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              color: "var(--black-text)",
              fontSize: "20px",
              fontWeight: "500",
              marginTop: "20px",
            }}
          >
            <HeatMapOutlined />
          </Link>

          <Title
            level={3}
            style={{
              textAlign: "center",
            }}
          >
            Đăng ký
          </Title>

          <Controller
            name="name"
            control={control}
            rules={{ required: "Họ và tên không được trống." }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Họ và tên"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input {...field} placeholder="Vui lòng nhập họ và tên..." />
              </Form.Item>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{ required: "Email không được trống." }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Email"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input {...field} placeholder="Vui lòng nhập email..." />
              </Form.Item>
            )}
          />

          <Controller
            name="username"
            control={control}
            rules={{ required: "Tên tài khoản không được trống." }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Tên tài khoản"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input
                  {...field}
                  placeholder="Vui lòng nhập tên tài khoản..."
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
            rules={{ required: "Mật khẩu không được trống." }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Mật khẩu"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Input.Password
                  {...field}
                  placeholder="Vui lòng nhập mật khẩu..."
                  onChange={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </Form.Item>
            )}
          />

          <Controller
            name="role"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label="Vai trò"
                validateStatus={error ? "error" : ""}
                help={error?.message}
              >
                <Select {...field} placeholder="Vui lòng chọn vai trò...">
                  <Option value="ROLE_STUDENT">Học sinh</Option>
                  <Option value="ROLE_TEACHER">Giáo viên</Option>
                </Select>
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button
              htmlType="submit"
              style={{
                background: "var(--blue-light)",
                color: "var(--white)",
                marginTop: "20px",
                width: "100%",
              }}
              icon={loading ? <Spin /> : null}
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Form.Item
            style={{
              textAlign: "center",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "var(--blue-dark)",
              }}
            >
              Bạn đã có tài khoản. Đăng nhập
            </Link>
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

export default Register;
