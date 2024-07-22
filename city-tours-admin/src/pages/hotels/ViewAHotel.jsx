import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Table,
  TimePicker,
  Typography,
  Image,
  Button,
  Tag,
  Card,
  Modal,
  InputNumber,
  Select,
  Popconfirm,
  notification,
  Slider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRoom,
  getHotelById,
  getRoomById,
} from "../../features/hotel/HotelSlice";
import "../../App.css";
import CustomText from "../../components/common/CustomText";
import Loading from "../../components/common/Loading";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import locale 'en' để sử dụng tiếng Anh
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faDoorOpen,
  faEye,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import Search from "antd/es/input/Search";
dayjs.extend(customParseFormat);
import { roomTypes } from "../../utils/enums/RoomTypes";
import { roomCategories } from "../../utils/enums/RoomCategories";

const { RangePicker } = DatePicker;

const { Meta } = Card;
const { Text } = Typography;
const { Option } = Select;

const ViewAHotel = () => {
  // Redux State
  const { hotelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hotel = useSelector((state) => state.hotels?.selectedHotel);
  const selectedRoom = useSelector((state) => state.hotels?.selectedRoom);
  const isLoading = useSelector((state) => state.hotels?.isLoading);
  const error = useSelector((state) => state.hotels?.error);

  // Local State
  const [showContent, setShowContent] = useState(false);
  const [isModalDetailRoom, setIsModalDetailRoom] = useState(false);
  const [isWeekend, setIsWeekend] = useState(null);

  // useEffect for loading data
  useEffect(() => {
    dispatch(getHotelById(hotelId));

    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, 1000);
    }
  }, [dispatch]);

  const getTagProps = (bookedStatus) => {
    let color, tagText;

    switch (bookedStatus) {
      case "CANCELLED":
        color = "red";
        tagText = "Cancelled";
        break;
      case "NOT_BOOKED":
        color = "blue";
        tagText = "Not Booked";
        break;
      case "BOOKED":
        color = "green";
        tagText = "Booked";
        break;
      case "ACTIVE":
        color = "cyan";
        tagText = "Active";
        break;
      case "IN_ACTIVE":
        color = "volcano";
        tagText = "Inactive";
        break;
      default:
        color = "default";
        tagText = "Unknown";
        break;
    }

    return { color, tagText };
  };

  const handleShowDetailRoom = (roomId) => {
    setIsModalDetailRoom(true);

    dispatch(getRoomById(roomId));
  };

  const handleOkDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  const handleCancelDetailRoom = () => {
    setIsModalDetailRoom(false);
  };

  const handleNavigateViewRoom = (roomId) => {
    navigate(`/admin/hotels/${hotelId}/room/${roomId}/view`);
  };

  useEffect(() => {
    const checkWeekendDay = () => {
      const currentDate = new Date();

      const dayOfWeek = currentDate.getDay();
      console.log("dayOfWeek: ", dayOfWeek);

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      setIsWeekend(isWeekend);
    };

    checkWeekendDay();
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero based
    const day = String(today.getDate()).padStart(2, "0");

    console.log(`${year}-${month}-${day}`);

    return `${year}-${month}-${day}`;
  };

  const handleNavigateUpdateRoom = (roomId) => {
    navigate(`/admin/hotels/${hotelId}/room/${roomId}/update`);
  };

  // Room update
  const roomsColumns = [
    {
      title: (
        <>
          STT <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      render: (text, record, index) => index + 1,
    },
    {
      title: (
        <>
          Type <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "type",
    },
    {
      title: (
        <>
          Caterory <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "category",
    },
    {
      title: (
        <>
          Number <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "roomNumber",
    },
    {
      title: (
        <>
          Views <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "roomViews",
      render: (roomViews) => (
        <>
          {roomViews.map((view) => (
            <Col
              key={view.id}
              span={24}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Tag>{view.name}</Tag>
              {view.images.split(",").map((image, idx) => (
                <Image
                  key={idx}
                  src={image}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Col>
          ))}
        </>
      ),
    },
    {
      title: (
        <>
          Images <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "imageUrls",
      render: (imageUrls) => (
        <>
          <Col
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {imageUrls.map((image, idx) => (
              <Image
                key={idx}
                src={image}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "5px",
                }}
              />
            ))}
          </Col>
        </>
      ),
    },
    {
      title: (
        <>
          Actions <FontAwesomeIcon icon={faCaretDown} />
        </>
      ),
      dataIndex: "actions",
      render: (text, record) => (
        <>
          <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateViewRoom(record?.id)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>

          <Button
            size="small"
            style={{
              color: "var(--gray-light)",
              marginRight: "5px",
            }}
            onClick={() => handleNavigateUpdateRoom(record?.id)}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </>
      ),
    },
  ];

  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // const onSearch = (value) => {
  //   console.log(value);
  // };

  const onChangeType = (value) => {
    console.log(value);
    setTypeFilter(value);
  };

  const onChangeCategory = (value) => {
    console.log(value);
    setCategoryFilter(value);
  };

  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
  };

  const onChangeComplete = (value) => {
    console.log("onChangeComplete: ", value);
    setPriceRange(value);
  };

  const filterRooms = () => {
    if (!hotel?.rooms) return [];

    return hotel?.rooms?.filter((room) => {
      const isTypeMatch =
        typeFilter.trim() !== "" ? room.type === typeFilter : true;
      const isCategoryMatch =
        categoryFilter.trim() !== "" ? room.category === categoryFilter : true;
      const { defaultPrice, weekdayPrice, weekendPrice } = room;

      const isPriceMatch =
        (defaultPrice >= priceRange[0] && defaultPrice <= priceRange[1]) ||
        (weekdayPrice >= priceRange[0] && weekdayPrice <= priceRange[1]) ||
        (weekendPrice >= priceRange[0] && weekendPrice <= priceRange[1]);

      return isTypeMatch && isCategoryMatch && isPriceMatch;
    });
  };

  console.log("typeFilter: ", typeFilter);
  console.log("categoryFilter: ", categoryFilter);
  console.log("priceRange: ", priceRange);
  console.log("filteredRooms: ", filteredRooms);

  useEffect(() => {
    if (hotel?.rooms) {
      setFilteredRooms(filterRooms());
    }
  }, [hotel?.rooms, typeFilter, categoryFilter, priceRange]);

  const marks = {
    0: "0đ",
    2500000: "2.500.000đ",
    5000000: "5.000.000đ",
    7500000: "7.500.000đ",
    10000000: "10.000.000đ",
  };

  return (
    <>
      {/* Show loading */}
      {!showContent && <Loading />}

      {/* Show error */}
      {error && <p>{error}</p>}

      {/* Show content */}
      {showContent && (
        <>
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
                        View A Hotel - {hotel?.name}
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
                <Link to={`/admin/hotels/update/${hotelId}`}>
                  <CustomText
                    size={"14px"}
                    weight={"500"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Update Hotel
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
                    <Form.Item label="Region">
                      <Input value={hotel?.regionName} readOnly />
                    </Form.Item>

                    <Form.Item label="Province">
                      <Input value={hotel?.provinceName} readOnly />
                    </Form.Item>

                    <Form.Item label="Name">
                      <Input value={hotel?.name} readOnly />
                    </Form.Item>

                    <Form.Item label="Description">
                      <Input value={hotel?.description} readOnly />
                    </Form.Item>

                    <Form.Item label="Address">
                      <Input value={hotel?.address} readOnly />
                    </Form.Item>

                    <Form.Item label="Active Status">
                      <Tag
                        color={
                          getTagProps(hotel?.activeStatus)?.color || "default"
                        }
                      >
                        {getTagProps(hotel?.activeStatus)?.tagText || "Unknown"}
                      </Tag>
                    </Form.Item>
                  </Col>

                  <Col xxl={11} xl={11} lg={12} md={12} sm={24} xs={24}>
                    <Form.Item label="Images">
                      <Row
                        style={{
                          width: "100%",
                        }}
                        gutter={[10, 10]}
                      >
                        {hotel?.thumbnailUrls?.map((url, index) => (
                          <Col
                            xxl={12}
                            xl={12}
                            lg={12}
                            key={index}
                            // style={{ marginBottom: "10px" }}
                          >
                            <Image
                              src={url}
                              width={"100%"}
                              height={"150px"}
                              style={{
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col xxl={24} xl={24} lg={24}>
              <Col
                xl={24}
                style={{
                  borderTop: "1px solid var(--border)",
                  padding: "20px 0 20px 0",
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
                          Rooms List
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
                  <Link to={`/admin/hotels/${hotelId}/room/create`}>
                    <CustomText
                      size={"14px"}
                      weight={"500"}
                      color={"var(--white)"}
                      isButton={true}
                    >
                      Create Room
                    </CustomText>
                  </Link>
                </Button>
              </Col>
              <Col
                span={24}
                style={{
                  padding: "0 40px 20px 0",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: "30px",
                }}
              >
                {/* <Search
                  placeholder="Search type and category"
                  onSearch={onSearch}
                  style={{
                    width: 300,
                  }}
                /> */}

                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Text>Types</Text>
                  <Select
                    onChange={onChangeType}
                    style={{
                      width: "150px",
                    }}
                    defaultValue={""}
                  >
                    <Option value={""}>All</Option>
                    {roomTypes?.map((type, index) => {
                      return (
                        <Option key={index} value={type}>
                          {type}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>

                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Text>Categories</Text>
                  <Select
                    onChange={onChangeCategory}
                    style={{
                      width: "150px",
                    }}
                    defaultValue={""}
                  >
                    <Option value={""}>All</Option>
                    {roomCategories?.map((cate, index) => {
                      return (
                        <Option key={index} value={cate}>
                          {cate}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>

                <Col
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text>Price</Text>
                  <Slider
                    range
                    min={0}
                    max={10000000}
                    step={100}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    onChangeComplete={onChangeComplete}
                    marks={marks}
                    style={{
                      width: "400px",
                    }}
                  />
                </Col>
              </Col>
              <Row gutter={16}>
                <Col span={24}>
                  <Table
                    columns={roomsColumns}
                    dataSource={filteredRooms}
                    rowKey="id"
                    pagination={false}
                    // pagination={{
                    //   pageSize: pagination.limit,
                    //   total:
                    //     Math.ceil(totalPages / pagination.limit) * pagination.limit,
                    //   current: currentPage,
                    // }}
                    // onChange={handleTableChange}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ViewAHotel;
