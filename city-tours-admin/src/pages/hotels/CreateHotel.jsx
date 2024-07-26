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
import { getAllRegions } from "../../features/region/RegionSlice";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link } from "react-router-dom";
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const CreateHotel = () => {
  // Constants
  const INIT_PAGE = 1;

  // Redux State
  const dispatch = useDispatch();
  const regions = useSelector((state) => state.regions?.list);
  const isLoading = useSelector((state) => state.website?.isLoading);
  const error = useSelector((state) => state.website?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [filteredProvinces, setFilteredProvinces] = useState([]);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(
      getAllRegions({
        page: INIT_PAGE,
        limit: "",
      })
    );

    // Delay showing content after loading
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  useEffect(() => {
    if (selectedRegion) {
      // Lọc danh sách tỉnh (provinces) theo vùng (region) đã chọn
      const selectedRegionFilter = regions.find(
        (region) => region.id === selectedRegion
      );
      if (selectedRegionFilter) {
        setFilteredProvinces(selectedRegionFilter.provinces);
      } else {
        setFilteredProvinces([]);
      }
    } else {
      setFilteredProvinces([]);
    }
  }, [selectedRegion, regions]);

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
        provinceId: selectedProvince,
        rating: data.rating,
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
                      Create Hotel
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
              <Link to="/admin/hotels/view">
                <CustomText
                  size={"14px"}
                  weight={"500"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Back
                </CustomText>
              </Link>
            </Button>
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
                    name="regions"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Regions"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            setSelectedRegion(value);
                          }}
                          placeholder="Choose province"
                        >
                          {regions?.map((region) => (
                            <Select.Option key={region.name} value={region.id}>
                              {region.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  />

                  <Controller
                    name="provinces"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Provinces"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <Select
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            setSelectedProvince(value);
                          }}
                          placeholder="Choose province"
                        >
                          {filteredProvinces.map((province) => (
                            <Select.Option
                              key={province.id}
                              value={province.id}
                            >
                              {province.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                  />

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

                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: "Rating is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <Form.Item
                        label="Rating"
                        validateStatus={error ? "error" : ""}
                        help={error?.message}
                      >
                        <InputNumber
                          {...field}
                          placeholder="Enter rating"
                          style={{
                            width: "100%",
                          }}
                          min={3}
                          max={5}
                        />
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
