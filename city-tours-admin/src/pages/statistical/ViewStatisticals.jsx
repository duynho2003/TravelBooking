import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  message,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../../features/transaction/TransactionSlice";
import "../../App.css";
import {
  faCaretDown,
  faCreditCard,
  faEye,
  faMoneyBill,
  faMoneyBill1,
  faPen,
  faPenToSquare,
  faTrash,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "antd/es/typography/Typography";
import Loading from "../../components/common/Loading";
import CustomText from "../../components/common/CustomText";
import { Link, useNavigate } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { paymentStatus } from "../../utils/enums/PaymentStatus";
import { transactionStatus } from "../../utils/enums/TransactionStatus";
import axios from "axios";
import Cookies from "js-cookie";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const ViewStatisticals = () => {
  // Local State
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statisticalData, setStatisticalData] = useState(null);

  // useEffect for loading data
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/statisticals",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response: ", response);

        setStatisticalData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      if (!isLoading) {
        setShowContent(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Event Handlers

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show content */}
      {showContent && (
        <>
          <Row
            style={{
              padding: "20px",
              // background: "var( --white)",
              borderRadius: "8px",
            }}
          >
            <Col
              xl={24}
              style={{
                padding: "0 0 20px 0",
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
                        View Statisticals
                      </CustomText>
                    ),
                  },
                ]}
              />
            </Col>

            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              <Col
                span={5}
                style={{
                  background: "var(--white)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--gray-light)",
                    }}
                  >
                    USERS
                  </Text>
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "var(--gray-text)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "10px",
                      }}
                    />
                    {statisticalData?.quantityUsers}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={"small"}
                    percent={90}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Col>
              </Col>

              <Col
                span={5}
                style={{
                  background: "var( --white)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--gray-light)",
                    }}
                  >
                    TOTAL INCOME
                  </Text>
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "var(--gray-text)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faMoneyBill}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "10px",
                      }}
                    />
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(statisticalData?.income)}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={"small"}
                    percent={90}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Col>
              </Col>

              <Col
                span={5}
                style={{
                  background: "var( --white)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--gray-light)",
                    }}
                  >
                    BOOKINGS
                  </Text>
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "var(--gray-text)",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faCreditCard}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "10px",
                      }}
                    />
                    {statisticalData?.quantityBookings}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={"small"}
                    percent={90}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Col>
              </Col>

              <Col
                span={5}
                style={{
                  background: "var( --white)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "var(--gray-light)",
                    }}
                  >
                    TRANSACTIONS
                  </Text>
                  <Text
                    style={{
                      fontSize: "18px",
                      fontWeight: "400",
                      color: "var(--gray-text)",
                      display: "flex",
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faMoneyBill1}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "10px",
                      }}
                    />
                    {statisticalData?.quantityTransactions}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={"small"}
                    percent={90}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                  />
                </Col>
              </Col>
            </Row>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewStatisticals;
