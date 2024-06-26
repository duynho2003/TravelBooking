import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  notification,
  DatePicker,
  Table,
  Collapse,
  TimePicker,
  Typography,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CreateHotel = () => {
  // Redux State
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.website?.isLoading);
  const error = useSelector((state) => state.website?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  // Event Handlers
  const uploadImages = async () => {
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const formData = new FormData();
        formData.append("thumbnail", image);

        const response = await axios.post(
          `http://localhost:5050/api/v1/auth/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response?.data?.data?.thumbnail;
      });

      const urls = await Promise.all(uploadPromises);
      setThumbnailUrls(urls);

      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const onSubmit = async (data) => {
    setLoadingButton(true);

    try {
      const urls = await uploadImages();

      const newData = {
        name: data.name,
        description: data.description,
        address: data.address,
        thumbnailUrls: urls,
      };

      console.log("thumbnailUrls: ", thumbnailUrls);

      console.log("newData: ", newData);

      const token = Cookies.get("token");

      await axios.post(`http://localhost:5050/api/v1/hotels/create`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      reset();
      resetFileInput();

      notification.success({
        message: "Hotel created successfully",
        description: "Hotel created successfully.",
      });
    } catch (error) {
      console.error("Error creating hotel:", error);
      notification.error({
        message: "System Error",
        description: "There was an error creating the tour.",
      });
    } finally {
      setLoadingButton(false);
    }
  };

  const resetFileInput = () => {
    const fileInput = document.getElementById("imageInput");
    if (fileInput) {
      fileInput.value = null;
    }
    setSelectedImages(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    console.log("selectedImages: ", selectedImages);
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
                      Create Hotel
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
                justify={"center"}
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
                        <Input {...field} placeholder="Enter name" />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Description is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Description"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Input {...field} placeholder="Enter description" />
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
                        <Input {...field} placeholder="Enter address" />
                      </Form.Item>
                    )}
                  />

                  <Form.Item
                    label="Images"
                    // validateStatus={thumbnailUrls.length === 0 ? "error" : ""}
                    // help={
                    //   thumbnailUrls.length === 0
                    //     ? "Please select at least one image"
                    //     : ""
                    // }
                  >
                    <input
                      id="imageInput"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                    />
                  </Form.Item>

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
                      Save
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

export default CreateHotel;
