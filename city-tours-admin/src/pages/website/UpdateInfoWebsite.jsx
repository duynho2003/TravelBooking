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
import { useDispatch, useSelector } from "react-redux";
import { getWebsiteInfo } from "../../features/website/WebsiteSlice";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import { workingDays } from "../../utils/data/WorkingDays";
import { workingHours } from "../../utils/data/WorkingHours";

const { Option } = Select;

const UpdateInfoWebsite = () => {
  // Constants
  const ID_INFO_WEBSITE = 1;

  // Redux State
  const dispatch = useDispatch();
  const website = useSelector((state) => state.website?.info);
  const isLoading = useSelector((state) => state.website?.isLoading);
  const error = useSelector((state) => state.website?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [errorChangeImage, setErrorChangeImage] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showContent, setShowContent] = useState(false);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getWebsiteInfo(ID_INFO_WEBSITE));

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  // useEffect for init data
  useEffect(() => {
    if (website) {
      const [startDay, endDay] = website?.workingDate?.split(" - ");
      const [startTime, endTime] = website?.workingTime?.split(" - ");

      reset({
        name: website?.name,
        logo: website?.logo,
        email: website?.email,
        phone: website?.phone,
        address: website?.address,
        startDate: startDay.trim(),
        endDate: endDay.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        // logo: website?.logo,
      });
    }
  }, [website, reset]);

  // Event Handlers
  const onSubmit = async (data) => {
    if (!selectedImage) {
      setErrorChangeImage(true);
      return;
    }

    const workingDate = `${data.startDate} - ${data.endDate}`;
    const workingTime = `${data.startTime} - ${data.endTime}`;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("workingDate", workingDate);
    formData.append("workingTime", workingTime);

    if (selectedImage) {
      formData.append("logo", selectedImage);
    }

    const token = Cookies.get("token");

    setLoadingButton(true);

    try {
      await axios.put(`http://localhost:5050/api/v1/websites/${15}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      notification.success({
        message: "Cập nhật thông tin website thành công",
        description: "Cập nhật hồ sơ giáo viên thành công.",
      });

      dispatch(getWebsiteInfo(15));
      setIsChangeImage(false);
      setErrorChangeImage(false);
    } catch (error) {
      notification.error({
        message: "Lỗi hệ thống",
        description:
          "Máy chủ không thực hiện được yêu cầu hợp lệ do lỗi với máy chủ.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleShowChangeImage = () => {
    setIsChangeImage(!isChangeImage);
  };

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

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
                      Update Info
                    </CustomText>
                  ),
                },
              ]}
            />
          </Col>
          <Col xl={24}>
            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <Row
                style={{
                  width: "100%",
                }}
                justify={"space-between"}
              >
                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
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
                    name="phone"
                    control={control}
                    rules={{ required: "Phone is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Phone"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />

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
                        <Input {...field} />
                      </Form.Item>
                    )}
                  />
                </Col>

                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label="Working day"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="From"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                          style={{
                            display: "inline-block",
                            width: "200px",
                            marginRight: "8px",
                          }}
                        >
                          <Select
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                              setStartDate(value);
                            }}
                          >
                            {workingDays.map((day) => (
                              <Option key={day} value={day}>
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    />
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="To"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                          style={{
                            display: "inline-block",
                            width: "200px",
                          }}
                        >
                          <Select
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                              setEndDate(value);
                            }}
                          >
                            {workingDays.map((day) => (
                              <Option key={day} value={day}>
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Working time"
                    style={{
                      marginBottom: 0,
                    }}
                  >
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="From"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                          style={{
                            display: "inline-block",
                            width: "200px",
                            marginRight: "8px",
                            marginBottom: 0,
                          }}
                        >
                          <Select
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                              setStartTime(value);
                            }}
                          >
                            {workingHours.map((day) => (
                              <Option key={day} value={day}>
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    />
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Form.Item
                          label="To"
                          validateStatus={error ? "error" : ""}
                          help={error?.message}
                          style={{
                            display: "inline-block",
                            width: "200px",
                          }}
                        >
                          <Select
                            {...field}
                            onChange={(value) => {
                              field.onChange(value);
                              setEndTime(value);
                            }}
                          >
                            {workingHours.map((day) => (
                              <Option key={day} value={day}>
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Form.Item>

                  <Form.Item label="Logo">
                    <Image
                      width={"100%"}
                      height={120}
                      src={website?.logo}
                      style={{
                        border: errorChangeImage
                          ? "1px solid var(--red)"
                          : "1px solid var(--bg-admin)",
                        borderRadius: "5px",
                        objectFit: "cover",
                      }}
                    />
                    {errorChangeImage && (
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--red)"}
                        isButton={true}
                      >
                        Please choose a new image logo
                      </CustomText>
                    )}
                    <br />
                    <Button
                      style={{
                        background: "var(--green-dark)",
                        color: "var(--white)",
                        border: "var(--green-dark)",
                        marginTop: "10px",
                      }}
                      onClick={handleShowChangeImage}
                    >
                      Change image
                    </Button>
                  </Form.Item>

                  {isChangeImage && (
                    <Controller
                      name="logo"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <input
                          id="imageInput"
                          type="file"
                          onChange={(e) => {
                            setSelectedImage(e.target.files[0]);
                            field.onChange(e.target.files[0]);
                            setErrorChangeImage(false);
                          }}
                        />
                      )}
                    />
                  )}

                  <Form.Item>
                    <Button
                      htmlType="submit"
                      style={{
                        background: "var(--pink)",
                        color: "var(--white)",
                        marginTop: "20px",
                        width: "100%",
                      }}
                      icon={loadingButton ? <Spin /> : null}
                      loading={loadingButton}
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default UpdateInfoWebsite;
