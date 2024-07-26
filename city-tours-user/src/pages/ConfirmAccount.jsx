import { Button, Col, Grid, Result, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomText from "../components/common/CustomText";
import Loading from "../components/common/Loading";
import axios from "axios";

const { useBreakpoint } = Grid;

export default function ConfirmAccount() {
  const screens = useBreakpoint();

  const { token } = useParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const confirmAccount = async () => {
      setShowContent(false);

      try {
        const response = await axios(
          `http://localhost:5050/api/v1/auth/confirm-account?${token}`
        );

        console.log("response: ", response);

        if (response?.status === 200) {
          const result = await response?.data?.message;
          setMessage(result);
          setLoading(false);
          setShowContent(true);
        } else {
          setMessage(null);
        }
      } catch (error) {
        setShowContent(true);
      } finally {
        setShowContent(true);
      }
    };

    confirmAccount();

    // if (!loading) {
    //   setTimeout(() => {
    //     setShowContent(true);
    //   }, 1000);
    // }
  }, [token]);

  return (
    <>
      {!showContent && <Loading />}

      {showContent && (
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
              height: "auto",
              background: "var(--bg-gray-light)",
              padding: "0",
            }}
            justify={"center"}
          >
            <Row
              gutter={20}
              style={{
                width: screens.xxl || screens.xl ? "1320px" : "100%",
                height: "100%",
                padding: "20px 0",
              }}
            >
              <Col
                span={24}
                style={{
                  background: "var( --white)",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  textAlign: "center",
                }}
              >
                <Result
                  status={message ? "success" : "error"}
                  title={
                    message ? (
                      <CustomText
                        size={"22px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        Confirm Account Successful
                      </CustomText>
                    ) : (
                      <CustomText
                        size={"22px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        Confirm Account Failed
                      </CustomText>
                    )
                  }
                  subTitle={
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Please check the status of your account confirmation below
                      for more details.
                    </CustomText>
                  }
                />

                <Button
                  size="large"
                  className="hover-button"
                  style={{
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginBottom: "30px",
                  }}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                    link={"/login"}
                  >
                    Back to login
                  </CustomText>
                </Button>
              </Col>
            </Row>
          </Row>
        </>
      )}
    </>
  );
}
