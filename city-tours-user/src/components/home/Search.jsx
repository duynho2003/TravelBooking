import { Button, Col, DatePicker, Form, Input, Row, Spin } from "antd";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomText from "../common/CustomText";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function Search() {
  const { control, handleSubmit } = useForm({});
  const navigate = useNavigate();

  // Local state
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");

  const onSubmit = (data) => {
    navigate(
      `/tours/list?minPrice=0&maxPrice=5000000&review=&rating=&depart=${data.depart}&startDate=${startDate}`
    );
  };

  const onChange = (date, dateString) => {
    console.log("date: ", dateString);
    setStartDate(dateString);
  };

  return (
    <Row
      style={{
        width: "900px",
        height: "auto",
        background: "var(--white)",
        position: "absolute",
        top: "570px",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        zIndex: "1",
        border: "1px solid var(--border)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Col span={24}>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          style={{
            background: "var(--white)",
            borderRadius: "5px",
            boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.2)",
            padding: "30px 30px 10px 30px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Form.Item>
            <CustomText
              size={"18px"}
              weight={"600"}
              color={"var(--gray-text)"}
              isButton={true}
            >
              Search tours quickly
            </CustomText>
          </Form.Item>

          <Row
            style={{
              width: "100%",
            }}
            justify={"space-between"}
          >
            <Col span={11}>
              <Controller
                name="depart"
                control={control}
                rules={{ required: "Depart is required." }}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    label="Depart"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <Input
                      prefix={<SearchOutlined />}
                      {...field}
                      placeholder="Enter depart"
                    />
                  </Form.Item>
                )}
              />
            </Col>

            <Col span={11}>
              <Controller
                name="startDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Form.Item
                    label="Start Date"
                    validateStatus={error ? "error" : ""}
                    help={error?.message}
                  >
                    <DatePicker
                      size="large"
                      showTime
                      onChange={onChange}
                      format={"HH:mm:ss - DD/MM/YYYY"}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              className="hover-button"
              style={{
                background: "var(--green-dark)",
                color: "var(--white)",
                width: "300px",
                borderRadius: "3px",
                cursor: "pointer",
                marginBottom: "0 !important",
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
                Search
              </CustomText>
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
