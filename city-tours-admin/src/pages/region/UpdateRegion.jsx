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
import { getRegionById, updateRegion } from "../../features/region/RegionSlice";
import "../../App.css";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import { userRoles } from "../../utils/enums/UserRoles";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { vietnamProvinces } from "../../utils/data/VietnamProvinces";

const { Option } = Select;

const UpdateRegion = () => {
  // Constants
  const DELAY_TIME = 1000;

  const { regionId } = useParams();
  const dispatch = useDispatch();
  const region = useSelector((state) => state.regions?.selectedRegion);
  const isLoading = useSelector((state) => state.regions?.isLoading);
  const error = useSelector((state) => state.regions?.error);

  // Local State
  const [loadingButton, setLoadingButton] = useState(false);
  const [roles, setRoles] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [newProvinces, setNewProvinces] = useState(null);
  const [provincesString, setProvincesString] = useState(null);

  // React Hook Form
  const { control, handleSubmit, reset } = useForm();

  // useEffect for loading data
  useEffect(() => {
    dispatch(getRegionById(regionId));

    setTimeout(() => {
      setShowContent(true);
    }, DELAY_TIME);
  }, []);

  // useEffect for init data
  useEffect(() => {
    if (region) {
      const convertProvincesString = region?.provinces?.map(
        (province) => province.name
      );

      setProvincesString(convertProvincesString);

      reset({
        nameRegion: region?.name,
      });
    }
  }, [region, reset]);

  // Event Handlers
  const onSubmit = async (data) => {
    const provinceObject = data.provinces?.map((name) => ({
      name,
    }));

    console.log("data provinces: ", data.provinces);

    const newData = {
      regionId: regionId,
      newData: {
        name: data.nameRegion,
        provinces: provinceObject,
      },
    };

    console.log(newData);

    setLoadingButton(true);

    try {
      const action = await dispatch(updateRegion(newData));

      console.log("action: ", action);

      if (updateRegion.fulfilled.match(action)) {
        if (action?.payload?.status === 200) {
          notification.success({
            message: "Updated region Successful",
            description: "Updated region Successful.",
          });

          dispatch(getRegionById(regionId));
        } else {
          const error =
            action?.payload?.error?.data?.message || "Unknown error.";
          notification.error({
            message: "Updated region Error",
            description: error,
          });
        }
      } else if (updateRegion.rejected.match(action)) {
        const error = action?.payload?.error?.data?.message || "Unknown error.";
        notification.error({
          message: "Updated region Error",
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
                      Update Region
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
              <Link to="/admin/regions/view">
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
                  name="nameRegion"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item
                      label="Name Region"
                      validateStatus={error ? "error" : ""}
                      help={error?.message}
                    >
                      <Input {...field} placeholder="Enter your name" />
                    </Form.Item>
                  )}
                />

                <Form.Item label="All Provinces">
                  <Select
                    mode="multiple"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    value={provincesString}
                    disabled
                  ></Select>
                </Form.Item>

                <Controller
                  name="provinces"
                  control={control}
                  rules={{ required: "Choose add province" }}
                  render={({ field, fieldState: { error } }) => (
                    <Form.Item
                      label="Add Province"
                      validateStatus={error ? "error" : ""}
                      help={error?.message}
                    >
                      <Select
                        {...field}
                        mode="multiple"
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        placeholder="Choose province"
                      >
                        {vietnamProvinces.map((province) => (
                          <Select.Option
                            key={province.value}
                            value={province.value}
                          >
                            {province.value}
                          </Select.Option>
                        ))}
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

export default UpdateRegion;
