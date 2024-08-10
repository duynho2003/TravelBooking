import { useEffect, useState, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Progress,
  Row,
  Select,
} from "antd";
import Typography from "antd/es/typography/Typography";
import Loading from "../../components/common/Loading";
import CustomText from "../../components/common/CustomText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBill,
  faMoneyBill1,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

const { Text } = Typography;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ViewStatisticals = () => {
  const [showContent, setShowContent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statisticalData, setStatisticalData] = useState(null);
  const [dateStr, setDateStr] = useState("");
  const [weekStr, setWeekStr] = useState("");
  const [monthStr, setMonthStr] = useState("");
  const [yearStr, setYearStr] = useState("");
  const [yearChartStr, setYearChartStr] = useState("");

  const [chartDataHotels, setChartDataHotels] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Income Hotels",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  const [chartDataTours, setChartDataTours] = useState({
    labels: [],
    datasets: [
      {
        label: "Monthly Income Tours",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const currentDate = dayjs().format("YYYY-MM-DD");
    setDateStr(currentDate);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      try {
        const params = {};

        if (dateStr) {
          params.dateStr = dateStr;
          setYearChartStr(dateStr?.slice(0, 4));
        }
        if (weekStr) {
          params.weekStr = weekStr;
          setYearChartStr(weekStr?.slice(0, 4));
        }
        if (monthStr) {
          params.monthStr = monthStr;
          setYearChartStr(monthStr?.slice(0, 4));
        }
        if (yearStr) {
          params.yearStr = yearStr;
          setYearChartStr(yearStr);
        }

        const response = await axios.get(
          `http://localhost:5050/api/v1/statisticals`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          }
        );

        setStatisticalData(response.data.data);

        console.log("statisticalData: ", statisticalData);
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
  }, [isLoading, dateStr, weekStr, monthStr, yearStr]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `http://localhost:5050/api/v1/statisticals/monthly-income-hotels/${yearChartStr}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response: ", response);

        const dataFromApi = response.data;

        const chartLabels = Object.keys(dataFromApi);
        const chartDataValues = Object.values(dataFromApi);

        setChartDataHotels({
          ...chartDataHotels,
          labels: chartLabels,
          datasets: [
            {
              ...chartDataHotels.datasets[0],
              data: chartDataValues,
            },
          ],
        });
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
  }, [isLoading, yearChartStr]);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `http://localhost:5050/api/v1/statisticals/monthly-income-tours/${yearChartStr}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response: ", response);

        const dataFromApi = response.data;

        const chartLabels = Object.keys(dataFromApi);
        const chartDataValues = Object.values(dataFromApi);

        setChartDataTours({
          ...chartDataTours,
          labels: chartLabels,
          datasets: [
            {
              ...chartDataTours.datasets[0],
              data: chartDataValues,
            },
          ],
        });
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
  }, [isLoading, yearChartStr]);

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    setDateStr(dateString);
  };

  const onChangeWeek = (date, dateString) => {
    console.log(date, dateString);
    setWeekStr(dateString);
  };

  const onChangeMonth = (date, dateString) => {
    console.log(date, dateString);
    setMonthStr(dateString);
  };

  const onChangeYear = (date, dateString) => {
    console.log(date, dateString);
    setYearStr(dateString);
  };

  // Chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Money",
        },
      },
    },
  };

  const customersPercent = statisticalData?.customerChangePercent || 0;
  const incomeHotelsPercent = statisticalData?.hotelIncomeChangePercent || 0;
  const incomeToursPercent = statisticalData?.tourIncomeChangePercent || 0;
  const transactionsPercent = statisticalData?.transactionChangePercent || 0;

  const getBorderColor = (percent) => {
    if (percent < 0) return "#f5222d";
    if (percent === 0) return "#1890ff";
    return "#87d068";
  };

  return (
    <>
      {!showContent && <Loading />}

      {showContent && (
        <>
          <Row
            style={{
              padding: "20px",
              borderRadius: "8px",
              background: "var(--white)",
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

            <Col
              xl={24}
              style={{
                padding: "0 0 20px 0",
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Col
                style={{
                  padding: "0 0 20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                  isButton={true}
                >
                  Date
                </CustomText>
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeDate}
                  defaultValue={dayjs(dateStr)}
                />
              </Col>

              {/* <Col
                style={{
                  padding: "0 0 20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                  isButton={true}
                >
                  Week
                </CustomText>
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeWeek}
                  picker="week"
                />
              </Col> */}

              {/* <Col
                style={{
                  padding: "0 0 20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                  isButton={true}
                >
                  Month
                </CustomText>
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeMonth}
                  picker="month"
                />
              </Col> */}

              <Col
                style={{
                  padding: "0 0 20px 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                  isButton={true}
                >
                  Year
                </CustomText>
                <DatePicker
                  disabledDate={disabledDate}
                  onChange={onChangeYear}
                  picker="year"
                />
              </Col>
            </Col>

            <Row
              style={{
                width: "100%",
              }}
              justify={"space-between"}
            >
              {/* Customers */}
              <Col
                span={5}
                style={{
                  background: "var(--white)",
                  borderTop: "1px solid var(--border)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
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
                    CUSTOMERS
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
                      icon={faUsers}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "5px",
                      }}
                    />
                    {statisticalData?.quantityCustomers}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={70}
                    percent={customersPercent}
                    strokeColor={getBorderColor(customersPercent)}
                    format={() => (
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: getBorderColor(customersPercent),
                        }}
                      >
                        {customersPercent}%
                      </Text>
                    )}
                  />
                </Col>
              </Col>

              {/* Income hotels */}
              <Col
                span={5}
                style={{
                  background: "var(--white)",
                  borderTop: "1px solid var(--border)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
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
                    INCOME HOTELS
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
                        marginRight: "5px",
                      }}
                    />
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(statisticalData?.incomeHotels)}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={70}
                    percent={incomeHotelsPercent}
                    strokeColor={getBorderColor(incomeHotelsPercent)}
                    format={() => (
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: getBorderColor(incomeHotelsPercent),
                        }}
                      >
                        {incomeHotelsPercent}%
                      </Text>
                    )}
                  />
                </Col>
              </Col>

              {/* Income tours */}
              <Col
                span={5}
                style={{
                  background: "var(--white)",
                  borderTop: "1px solid var(--border)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
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
                    INCOME TOURS
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
                      icon={faMoneyBill}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "5px",
                      }}
                    />
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(statisticalData?.incomeTours)}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={70}
                    percent={incomeToursPercent}
                    strokeColor={getBorderColor(incomeToursPercent)}
                    format={() => (
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: getBorderColor(incomeToursPercent),
                        }}
                      >
                        {incomeToursPercent}%
                      </Text>
                    )}
                  />
                </Col>
              </Col>

              {/* Transactions */}
              <Col
                span={5}
                style={{
                  background: "var(--white)",
                  borderTop: "1px solid var(--border)",
                  borderLeft: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "6px solid var(--green-dark)",
                  height: "auto",
                  borderRadius: "5px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
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
                      icon={faCreditCard}
                      style={{
                        fontSize: "22px",
                        color: "var(--green-dark)",
                        marginRight: "5px",
                      }}
                    />
                    {statisticalData?.quantityTransactions}
                  </Text>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    size={70}
                    percent={transactionsPercent}
                    strokeColor={getBorderColor(transactionsPercent)}
                    format={() => (
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: getBorderColor(transactionsPercent),
                        }}
                      >
                        {transactionsPercent}%
                      </Text>
                    )}
                  />
                </Col>
              </Col>
            </Row>

            <Row
              style={{ width: "100%", marginTop: "40px" }}
              justify="space-between"
            >
              <Col
                span={11}
                style={{
                  background: "var(--white)",
                  borderRadius: "5px",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Line data={chartDataHotels} options={options} />
              </Col>
              <Col
                span={11}
                style={{
                  background: "var(--white)",
                  borderRadius: "5px",
                  padding: "10px",
                  border: "1px solid var(--border)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Line data={chartDataTours} options={options} />
              </Col>
            </Row>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewStatisticals;
