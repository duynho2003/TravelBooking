import { useEffect, useState } from "react";
import { Breadcrumb, Button, Col, Form, Image, Input, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getWebsiteInfo } from "../../features/website/WebsiteSlice";
import "../../App.css";
import { Link } from "react-router-dom";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";

const { Option } = Select;

const ViewInfoWebsite = () => {
  // Constants
  const ID_INFO_WEBSITE = 1;

  // Redux State
  const dispatch = useDispatch();
  const website = useSelector((state) => state.website?.info);
  const isLoading = useSelector((state) => state.website?.isLoading);
  const error = useSelector((state) => state.website?.error);

  // Local State
  const [showContent, setShowContent] = useState(false);

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

  // Extract working date and time from website data
  const workingDate = website?.workingDate;
  const workingTime = website?.workingTime;

  // Split the working date and working time
  const [startDate, endDate] = workingDate
    ? workingDate.split(" - ")
    : ["", ""];
  const [startTime, endTime] = workingTime
    ? workingTime.split(" - ")
    : ["", ""];

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
                      View Info
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
              <Link to="/admin/website/update">
                <CustomText
                  size={"14px"}
                  weight={"500"}
                  color={"var(--white)"}
                  isButton={true}
                >
                  Update Info
                </CustomText>
              </Link>
            </Button>
          </Col>
          <Col xl={24}>
            <Form layout="vertical">
              <Row
                style={{
                  width: "100%",
                }}
                justify={"space-between"}
              >
                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label="Name"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input value={website?.name} readOnly />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input value={website?.email} readOnly />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input value={website?.phone} readOnly />
                  </Form.Item>

                  <Form.Item
                    label="Address"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input value={website?.address} readOnly />
                  </Form.Item>
                </Col>

                <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                  <Form.Item
                    label="Working day"
                    style={{
                      marginBottom: 0,
                    }}
                  >
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
                      <Select defaultValue={startDate}>
                        <Option value={startDate}>{startDate}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="To"
                      validateStatus={error ? "error" : ""}
                      help={error?.message}
                      style={{
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      <Select defaultValue={endDate}>
                        <Option value={endDate}>{endDate}</Option>
                      </Select>
                    </Form.Item>
                  </Form.Item>

                  <Form.Item
                    label="Working time"
                    style={{
                      marginBottom: 0,
                    }}
                  >
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
                      <Select defaultValue={startTime}>
                        <Option value={startTime}>{startTime}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="To"
                      validateStatus={error ? "error" : ""}
                      help={error?.message}
                      style={{
                        display: "inline-block",
                        width: "200px",
                      }}
                    >
                      <Select defaultValue={endTime}>
                        <Option value={endTime}>{endTime}</Option>
                      </Select>
                    </Form.Item>
                  </Form.Item>

                  <Form.Item label="Logo">
                    <Image
                      width={"100%"}
                      height={120}
                      src={website?.logo}
                      style={{
                        border: "1px solid var(--bg-admin)",
                        borderRadius: "5px",
                        objectFit: "cover",
                      }}
                    />
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

export default ViewInfoWebsite;
