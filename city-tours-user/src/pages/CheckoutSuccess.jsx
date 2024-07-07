import {
  Button,
  Col,
  Collapse,
  Grid,
  Result,
  Row,
  Table,
  notification,
} from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllTours, getTourById } from "../features/tour/TourSlice";
import { getAllHotels } from "../features/hotel/HotelSlice";
import Banner from "../components/checkout/Banner";
import Content from "../components/checkout/Content";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import Cookies from "js-cookie";
import axios from "axios";
import { paymentStatus } from "../utils/enums/PaymentStatus";
import { transactionStatus } from "../utils/enums/TransactionStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import CustomText from "../components/common/CustomText";

const { useBreakpoint } = Grid;

export default function CheckoutSuccess() {
  const location = useLocation();
  const userId = useSelector((state) => state.auth?.info?.id);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const screens = useBreakpoint();

  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    // Tạo object chứa dữ liệu từ URL
    const data = {
      transactionNo: queryParams?.vnp_TransactionNo,
      transactionStatus: queryParams?.vnp_TransactionStatus,
      responseCode: queryParams?.vnp_ResponseCode,
      bankCode: queryParams?.vnp_BankCode,
      bankTranNo: queryParams?.vnp_BankTranNo,
      cardType: queryParams?.vnp_CardType,
      amount: queryParams?.vnp_Amount,
      orderInfo: queryParams?.vnp_OrderInfo,
      payDate: queryParams?.vnp_PayDate,
    };

    setPaymentData(data);
    setLoading(false);

    if (paymentData !== null) {
      onAddTransaction();
    }
  }, [location.search]);

  const transactionStatusCodes = {
    "00": "Giao dịch thành công",
    "01": "Giao dịch chưa hoàn tất",
    "02": "Giao dịch bị lỗi",
    "04": "Giao dịch đảo",
    "05": "VNPAY đang xử lý",
    "06": "VNPAY đã gửi yêu cầu hoàn tiền",
    "07": "Giao dịch bị nghi ngờ gian lận",
    "09": "Giao dịch hoàn trả bị từ chối",
  };

  const responseCodes = {
    "00": "Giao dịch thành công",
    "07": "Giao dịch bị nghi ngờ gian lận",
    "09": "Không thành công: Thẻ chưa đăng ký",
    10: "Không thành công: Xác thực thông tin không đúng",
    11: "Không thành công: Hết hạn chờ thanh toán",
    12: "Không thành công: Thẻ bị khóa",
    13: "Không thành công: Sai mật khẩu OTP",
    24: "Không thành công: Hủy giao dịch",
    51: "Không thành công: Tài khoản không đủ số dư",
    65: "Không thành công: Vượt quá hạn mức giao dịch",
    75: "Không thành công: Ngân hàng bảo trì",
    79: "Không thành công: Sai mật khẩu thanh toán",
    99: "Các lỗi khác",
  };

  const columns = [
    {
      title: (
        <>
          Name <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record) => record.name,
      width: "30%",
    },
    {
      title: (
        <>
          Value <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record) => record.value,
      width: "30%",
    },
    {
      title: (
        <>
          Description <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record) => record.description,
      width: "40%",
    },
  ];

  const formatPayDate = (payDate) => {
    if (!payDate) return "";

    const year = payDate.slice(0, 4);
    const month = payDate.slice(4, 6);
    const day = payDate.slice(6, 8);
    const hours = payDate.slice(8, 10);
    const minutes = payDate.slice(10, 12);
    const seconds = payDate.slice(12, 14);

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  const sortedPaymentData = [
    {
      key: "transactionNo",
      name: "Transaction No",
      value: paymentData?.transactionNo,
      description: "Mã giao dịch ghi nhận tại hệ thống VNPAY",
    },
    {
      key: "transactionStatus",
      name: "Transaction Status",
      value: paymentData?.transactionStatus,
      description:
        transactionStatusCodes[paymentData?.transactionStatus] ||
        "Không xác định",
    },
    {
      key: "responseCode",
      name: "Response Code",
      value: paymentData?.responseCode,
      description: responseCodes[paymentData?.responseCode] || "Không xác định",
    },
    {
      key: "bankCode",
      name: "Bank Code",
      value: paymentData?.bankCode,
      description: "Mã Ngân hàng thanh toán",
    },

    {
      key: "bankTranNo",
      name: "Bank Tran No",
      value: paymentData?.bankTranNo || "No Bank Tran No",
      description: "Mã giao dịch tại Ngân hàng",
    },

    {
      key: "cardType",
      name: "Card Type",
      value: paymentData?.cardType,
      description: "Loại tài khoản/thẻ khách hàng sử dụng: ATM, QRCODE",
    },

    {
      key: "amount",
      name: "Amount",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(paymentData?.amount / 100),
      description: "Số tiền thanh toán",
    },
    {
      key: "orderInfo",
      name: "Order Info",
      value: paymentData?.orderInfo,
      description:
        "Thông tin mô tả nội dung thanh toán (Tiếng Việt, không dấu)",
    },
    {
      key: "payDate",
      name: "Pay Date",
      value: formatPayDate(paymentData?.payDate),
      description: "Thời gian thanh toán",
    },
  ];

  // Event Handlers
  const onAddTransaction = async () => {
    const newData = {
      userId: userId,
      code: paymentData?.transactionNo,
      type: "Booking tour",
      bankCode: paymentData?.bankCode,
      bankTranNo: paymentData?.bankTranNo || "",
      cardType: paymentData?.cardType,
      amount: paymentData?.amount,
      content: paymentData?.orderInfo,
      payDate: paymentData?.payDate,
      paymentStatus:
        paymentData?.responseCode === "00"
          ? paymentStatus.SUCCESS
          : transactionStatus.FAILED,
      transactionStatus:
        paymentData?.transactionStatus === "00"
          ? transactionStatus.COMPLETED
          : transactionStatus.FAILED,
    };

    console.log("paymentData: ", paymentData);
    console.log("newData: ", newData);

    const token = Cookies.get("token");

    try {
      await axios.post(`http://localhost:5050/api/v1/transactions`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error creating tour:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra nếu paymentData có dữ liệu thì gọi onAddTransaction
    if (paymentData !== null) {
      onAddTransaction();
    }
  }, [paymentData, onAddTransaction]);

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "110px",
        }}
      ></Row>

      <>
        {/* Hiển thị loading */}
        {loading && <p>Loading...</p>}

        {/* Hiển thị nội dung */}
        {!loading && (
          <>
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
                    status={
                      paymentData?.transactionStatus === "00"
                        ? "success"
                        : "error"
                    }
                    title={
                      paymentData?.transactionStatus === "00" ? (
                        <CustomText
                          size={"22px"}
                          weight={"400"}
                          color={"var(--gray-text)"}
                        >
                          Payment Successful
                        </CustomText>
                      ) : (
                        <CustomText
                          size={"22px"}
                          weight={"400"}
                          color={"var(--gray-text)"}
                        >
                          Payment Failed
                        </CustomText>
                      )
                    }
                    subTitle={
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--gray-text)"}
                      >
                        For more details, please review the transaction details
                        in the table below
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
                      link={"/"}
                    >
                      Back to home
                    </CustomText>
                  </Button>
                </Col>

                <Col
                  span={24}
                  style={{
                    padding: "0px 20px 20px 20px",
                    background: "var( --white)",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  <Table
                    columns={columns}
                    dataSource={sortedPaymentData}
                    pagination={false}
                    bordered
                  />
                </Col>
              </Row>
            </Row>
          </>
        )}
      </>
    </>
  );
}
