import {
  Col,
  Row,
  Grid,
  Breadcrumb,
  Button,
  Rate,
  Avatar,
  DatePicker,
  TimePicker,
  Timeline,
  Input,
  Table,
  InputNumber,
  Select,
} from "antd";
import category1 from "../../assets/images/category-1.jpg";
import category2 from "../../assets/images/category-2.jpg";
import category3 from "../../assets/images/category-3.png";
import CustomText from "../common/CustomText";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChild,
  faDog,
  faHotel,
  faLocationDot,
  faPersonBreastfeeding,
  faPhone,
  faPhoneVolume,
  faVolumeHigh,
  faWheelchair,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import {
  faHeart,
  faCalendar,
  faClock,
} from "@fortawesome/free-regular-svg-icons";
import {
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { getTourById } from "../../features/tour/TourSlice";
import { useEffect, useState } from "react";
import { tourBooking } from "../../features/tour/TourSlice";
dayjs.extend(customParseFormat);
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { GOONG_MAP_KEY } from "../../utils/Constants";
import goongjs from "@goongmaps/goong-js";
import polyline from "@mapbox/polyline";
import goongApi from "../../services/goongJs/goongApi";

const { useBreakpoint } = Grid;
const { Option } = Select;

export default function Content({ tour }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sub = useSelector((state) => state.auth?.info?.sub);

  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [quantityAdults, setQuantityAdults] = useState(1);
  const [quantityChildren, setQuantityChildren] = useState(0);
  const [quantityBaby, setQuantityBaby] = useState(0);

  const sanitizedHTML = DOMPurify.sanitize(tour?.detail);

  // Ant Design
  const screens = useBreakpoint();

  const customIcons = {
    1: <FrownOutlined />,
    2: <FrownOutlined />,
    3: <MehOutlined />,
    4: <SmileOutlined />,
    5: <SmileOutlined />,
  };

  const formatDays = (dates) => {
    if (!dates || dates.length === 0) return "";
    return dates.map((schedule) => schedule.date).join(" - ");
  };

  const tourTimesColumns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
  ];

  const dataSourceTourTimes = tour?.tourTimes?.map((item, index) => ({
    key: index + 1,
    startDate: item.startDate,
    endDate: item.endDate,
  }));

  const tourLocationsColumns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Start Point",
      dataIndex: "startPoint",
      key: "startPoint",
    },
    {
      title: "End Point",
      dataIndex: "endPoint",
      key: "endPoint",
    },
  ];

  const dataSourceTourLocations = tour?.tourLocations?.map((item, index) => ({
    key: index + 1,
    startPoint: item.startPoint,
    endPoint: item.endPoint,
  }));

  const onChangeStartTime = (value) => {
    console.log("change startTime", value);
    setSelectedStartTime(value);
    setErrorStartTime(null);
  };

  const onChangeAdults = (value) => {
    console.log("change adults", value);
    setQuantityAdults(value);
  };

  const onChangeChildren = (value) => {
    console.log("change adults", value);
    setQuantityChildren(value);
  };

  const onChangeBaby = (value) => {
    console.log("change adults", value);
    setQuantityBaby(value);
  };

  const [errorStartTime, setErrorStartTime] = useState(null);

  const handleNavigateCheckout = (tourId) => {
    if (!selectedStartTime) {
      setErrorStartTime("Please choose start time");
      return;
    }

    if (sub) {
      dispatch(
        tourBooking({
          tourId: tourId,
          startTime: selectedStartTime,
          adults: quantityAdults,
          children: quantityChildren,
          baby: quantityBaby,
          discount: tour.discount,
          totalAmount:
            quantityAdults * (tour?.priceAdult - tour?.discount) +
            quantityChildren * (tour?.priceChild - tour?.discount) +
            quantityBaby *
              (tour?.priceBaby === 0
                ? tour?.priceBaby
                : tour?.priceBaby - tour?.discount),
        })
      );
      navigate(`/checkout/${tourId}`);
    } else {
      navigate("/login");
    }
  };

  const dataStartTimes = tour?.tourTimes?.map(
    (tourTime) => tourTime?.startDate
  );

  // const [isOpenMap, setIsOpenMap] = useState(false);

  // const handleShowMap = () => {
  //   console.log("Show map");

  //   // setIsOpenMap(!isOpenMap);

  //   goongjs.accessToken = GOONG_MAP_KEY;

  //   let defaultCenter = [106.70105355500004, 10.776553100000058];

  //   const map = new goongjs.Map({
  //     container: "map",
  //     style: "https://tiles.goong.io/assets/goong_map_web.json",
  //     center: defaultCenter,
  //     zoom: 9,
  //   });

  //   // Check markerPosition and add marker if not at default
  //   // if (markerPosition[0] !== 0 || markerPosition[1] !== 0) {
  //   //   const marker = new goongjs.Marker({ color: "red" })
  //   //     .setLngLat(markerPosition)
  //   //     .addTo(map);

  //   //   map.flyTo({
  //   //     center: markerPosition,
  //   //     zoom: 13,
  //   //     essential: true,
  //   //   });
  //   // }

  //   return () => {
  //     map.remove();
  //   };
  // };

  const [polylinePoints, setPolylinePoints] = useState(null);

  const handleGetGoongMapsDirections = async (origin, destination) => {
    try {
      const data = { origin, destination };
      const response = await goongApi.direction(data);
      return response.routes[0].overview_polyline.points;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // useEffect(() => {
  //   console.log("tour locations", tour?.tourLocations);

  //   goongjs.accessToken = GOONG_MAP_KEY;

  //   const defaultCenter = [106.70105355500004, 10.776553100000058];
  //   const map = new goongjs.Map({
  //     container: "map",
  //     style: "https://tiles.goong.io/assets/goong_map_web.json",
  //     center: defaultCenter,
  //     zoom: 8,
  //   });

  //   const getUniqueCoordinates = (locations) => {
  //     const uniqueCoordinates = new Set();
  //     locations.forEach((location) => {
  //       const { coordinatesStartPoint, coordinatesEndPoint } = location;
  //       if (coordinatesStartPoint) uniqueCoordinates.add(coordinatesStartPoint);
  //       if (coordinatesEndPoint) uniqueCoordinates.add(coordinatesEndPoint);
  //     });
  //     return Array.from(uniqueCoordinates).map((coord) => JSON.parse(coord));
  //   };

  //   const uniqueCoords = getUniqueCoordinates(tour?.tourLocations);
  //   console.log("uniqueCoords: ", uniqueCoords);

  //   const fetchAllDirections = async () => {
  //     const allPolylines = [];
  //     for (let i = 0; i < uniqueCoords.length - 1; i++) {
  //       const origin = [uniqueCoords[i].lat, uniqueCoords[i].lng];
  //       const destination = [uniqueCoords[i + 1].lat, uniqueCoords[i + 1].lng];
  //       const polylinePoints = await handleGetGoongMapsDirections(
  //         origin,
  //         destination
  //       );
  //       if (polylinePoints) allPolylines.push(polylinePoints);
  //     }
  //     setPolylinePoints(allPolylines);
  //   };

  //   if (uniqueCoords.length > 0) {
  //     uniqueCoords.forEach((coord, index) => {
  //       if (coord && coord.lng !== undefined && coord.lat !== undefined) {
  //         const color = index === 0 ? "green" : "red";
  //         new goongjs.Marker({ color })
  //           .setLngLat([coord.lng, coord.lat])
  //           .addTo(map);
  //       } else {
  //         console.warn("Invalid coordinate:", coord);
  //       }
  //     });

  //     map.on("load", async function () {
  //       await fetchAllDirections();

  //       const layers = map.getStyle().layers;
  //       let firstSymbolId;

  //       for (let layer of layers) {
  //         if (layer.type === "symbol") {
  //           firstSymbolId = layer.id;
  //           break;
  //         }
  //       }

  //       if (polylinePoints && polylinePoints?.length > 0) {
  //         // Remove existing source and add new polylines
  //         polylinePoints.forEach((points, index) => {
  //           const geoJSON = polyline.toGeoJSON(points);

  //           const sourceId = `route-${index}`; // Unique source ID for each polyline
  //           if (map.getSource(sourceId)) {
  //             map.removeSource(sourceId);
  //           }

  //           map.addSource(sourceId, {
  //             type: "geojson",
  //             data: geoJSON,
  //           });

  //           // Check if the layer already exists before adding
  //           if (!map.getLayer(sourceId)) {
  //             map.addLayer(
  //               {
  //                 id: sourceId,
  //                 type: "line",
  //                 source: sourceId,
  //                 layout: {
  //                   "line-join": "round",
  //                   "line-cap": "round",
  //                 },
  //                 paint: {
  //                   "line-color": "#1e88e5",
  //                   "line-width": 8,
  //                 },
  //               },
  //               firstSymbolId
  //             );
  //           }
  //         });
  //       }

  //       const bounds = new goongjs.LngLatBounds();
  //       uniqueCoords.forEach((coord) => {
  //         bounds.extend([coord.lng, coord.lat]);
  //       });

  //       map.fitBounds(bounds, { padding: 100 });
  //     });
  //   }

  //   return () => {
  //     map.remove();
  //   };
  // }, [tour]);

  useEffect(() => {
    console.log("tour locations", tour?.tourLocations);

    goongjs.accessToken = GOONG_MAP_KEY;

    const defaultCenter = [106.70105355500004, 10.776553100000058];
    const map = new goongjs.Map({
      container: "map",
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: defaultCenter,
      zoom: 8,
    });

    const getUniqueCoordinates = (locations) => {
      const uniqueCoordinates = new Set();
      locations.forEach((location) => {
        const { coordinatesStartPoint, coordinatesEndPoint } = location;
        if (coordinatesStartPoint) uniqueCoordinates.add(coordinatesStartPoint);
        if (coordinatesEndPoint) uniqueCoordinates.add(coordinatesEndPoint);
      });
      return Array.from(uniqueCoordinates).map((coord) => JSON.parse(coord));
    };

    const uniqueCoords = getUniqueCoordinates(tour?.tourLocations);
    console.log("uniqueCoords: ", uniqueCoords);

    const fetchAllDirections = async () => {
      const allPolylines = [];
      for (let i = 0; i < uniqueCoords.length - 1; i++) {
        const origin = [uniqueCoords[i].lat, uniqueCoords[i].lng];
        const destination = [uniqueCoords[i + 1].lat, uniqueCoords[i + 1].lng];
        const polylinePoints = await handleGetGoongMapsDirections(
          origin,
          destination
        );
        if (polylinePoints) allPolylines.push(polylinePoints);
      }
      return allPolylines; // Return the fetched polylines
    };

    map.on("load", async function () {
      // Add markers for each unique coordinate
      uniqueCoords.forEach((coord, index) => {
        if (coord && coord.lng !== undefined && coord.lat !== undefined) {
          const marker = new goongjs.Marker({ color: "red" })
            .setLngLat([coord.lng, coord.lat])
            .addTo(map);

          const popup = new goongjs.Popup()
            .setLngLat([coord.lng, coord.lat])
            .setHTML(`Ngày ${index + 1}`) // Displaying Ngày 1, Ngày 2, etc.
            .addTo(map);

          // Attach popup to marker
          marker.setPopup(popup);
        } else {
          console.warn("Invalid coordinate:", coord);
        }
      });

      // Fetch all directions and render polylines
      const polylines = await fetchAllDirections();

      const layers = map.getStyle().layers;
      let firstSymbolId;

      for (let layer of layers) {
        if (layer.type === "symbol") {
          firstSymbolId = layer.id;
          break;
        }
      }

      if (polylines.length > 0) {
        polylines.forEach((points, index) => {
          const geoJSON = polyline.toGeoJSON(points);

          const sourceId = `route-${index}`; // Unique source ID for each polyline
          if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
          }

          map.addSource(sourceId, {
            type: "geojson",
            data: geoJSON,
          });

          // Add layer if it doesn't already exist
          if (!map.getLayer(sourceId)) {
            map.addLayer(
              {
                id: sourceId,
                type: "line",
                source: sourceId,
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#1e88e5",
                  "line-width": 8,
                },
              },
              firstSymbolId
            );
          }
        });
      }

      // Calculate bounds to fit all markers
      const bounds = new goongjs.LngLatBounds();
      uniqueCoords.forEach((coord) => {
        bounds.extend([coord.lng, coord.lat]);
      });

      // Zoom the map to fit all points
      map.fitBounds(bounds, { padding: 100 });
    });

    return () => {
      map.remove();
    };
  }, [tour]);

  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "auto",
          background: "white",
          padding: "0",
          borderBottom: "1px solid var(--border)",
        }}
        justify={"center"}
      >
        <Row
          style={{
            width: screens.xxl || screens.xl ? "1320px" : "100%",
            height: "100%",
            background: "white",
          }}
        >
          <Row
            style={{
              width: "100%",
              height: "auto",
              padding: "12px 0",
              background: "white",
            }}
          >
            <Breadcrumb
              items={[
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/"}
                    >
                      <FontAwesomeIcon icon={faLocationDot} /> Home
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                      link={"/tours"}
                    >
                      Tours
                    </CustomText>
                  ),
                },
                {
                  title: (
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--black-text)"}
                    >
                      {tour?.name}
                    </CustomText>
                  ),
                },
              ]}
            />
          </Row>
        </Row>
      </Row>

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
            padding: "40px 0",
          }}
        >
          <Col
            span={24}
            style={{
              height: "400px",
              marginBottom: "20px",
            }}
          >
            <div
              id="map"
              style={{
                width: "100%",
                height: "400px",
              }}
            ></div>
          </Col>

          {/* Col content */}
          <Col span={16}>
            {/* Utilities */}
            <Row
              style={{
                width: "100%",
                borderBottom: "2px solid var(--gray-light)",
              }}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faHotel}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Hotel
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faClock}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  3 days
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faWheelchair}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Accessibility
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  999 likes
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faDog}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Pet allowed
                </CustomText>
              </Col>

              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <FontAwesomeIcon
                  icon={faVolumeHigh}
                  style={{
                    fontSize: "36px",
                    color: "var(--gray-light)",
                  }}
                />
                <CustomText
                  size={"15px"}
                  weight={"500"}
                  color={"var(--gray-light)"}
                >
                  Audio guide
                </CustomText>
              </Col>
            </Row>

            {/* Description */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Description
                </CustomText>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-light)"}
                >
                  {tour?.description}
                </CustomText>
              </Col>
            </Row>

            {/* Detail */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Detail
                </CustomText>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizedHTML,
                  }}
                />
              </Col>
            </Row>

            {/* Times */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Times
                </CustomText>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <Table
                  columns={tourTimesColumns}
                  dataSource={dataSourceTourTimes}
                  pagination={false}
                  style={{
                    width: "100%",
                  }}
                />
              </Col>
            </Row>

            {/* Locations */}
            <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Locations
                </CustomText>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <Table
                  columns={tourLocationsColumns}
                  dataSource={dataSourceTourLocations}
                  pagination={false}
                  style={{
                    width: "100%",
                  }}
                />
              </Col>
            </Row>

            {/* Reivews */}
            {/* <Row
              style={{
                width: "100%",
                padding: "20px 0",
              }}
              justify={"space-between"}
            >
              <Col
                span={4}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "10px",
                  padding: "10px 0",
                }}
              >
                <CustomText
                  size={"22px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Reviews
                </CustomText>

                <Button
                  htmlType="submit"
                  size="large"
                  className="hover-button"
                  style={{
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                  >
                    Leave a review
                  </CustomText>
                </Button>
              </Col>

              <Col
                span={18}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: "15px",
                  padding: "10px 0",
                }}
              >
                <Row>
                  <CustomText
                    size={"18px"}
                    weight={"400"}
                    color={"var(--gray-light)"}
                  >
                    {tour?.numberOfRating} Reviews{" "}
                    <Rate
                      disabled
                      value={tour?.numberOfRating}
                      character={({ index = 0 }) => customIcons[index + 1]}
                      style={{
                        fontSize: "15px",
                        color: "var(--orange)",
                        marginRight: "5px",
                      }}
                    />
                  </CustomText>
                </Row>

                <Row
                  style={{
                    width: "100%",
                    padding: "20px 0",
                  }}
                >
                  <Row
                    justify={"space-between"}
                    style={{
                      width: "100%",
                      padding: "20px 0",
                    }}
                  >
                    <Col>
                      <Avatar
                        size={60}
                        icon={<UserOutlined />}
                        style={{
                          marginRight: "10px",
                        }}
                      />
                      <CustomText
                        size={"18px"}
                        weight={"500"}
                        color={"var(--black-light)"}
                      >
                        John Doe
                      </CustomText>
                    </Col>

                    <Col>
                      <CustomText
                        size={"12px"}
                        weight={"400"}
                        color={"var(--black-light)"}
                        isItalic={true}
                      >
                        26/06/2024
                      </CustomText>
                    </Col>
                  </Row>

                  <Row
                    justify={"space-between"}
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col>
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--black-light)"}
                      >
                        "Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed a lorem quis neque interdum consequat ut sed
                        sem. Duis quis tempor nunc. Interdum et malesuada fames
                        ac ante ipsum primis in faucibus."
                      </CustomText>
                    </Col>
                  </Row>

                  <Row
                    justify={"space-between"}
                    style={{
                      width: "100%",
                      padding: "20px 0",
                      borderBottom: "2px solid var(--border)",
                    }}
                  >
                    <Col>
                      <Rate
                        defaultValue={5}
                        character={({ index = 0 }) => customIcons[index + 1]}
                        style={{
                          fontSize: "15px",
                          color: "var(--orange)",
                          marginRight: "15px !important",
                        }}
                      />
                    </Col>
                  </Row>
                </Row>
              </Col>
            </Row> */}
          </Col>

          {/* Col booking */}
          <Col
            span={8}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* <Button
              size="large"
              className="hover-button"
              style={{
                width: "100%",
                background: "var(--pink)",
                border: "var(--green-dark)",
                color: "var(--white)",
                borderRadius: "3px",
                cursor: "pointer",
              }}
              // onClick={handleShowMap}
            >
              <CustomText
                size={"14px"}
                weight={"600"}
                color={"var(--white)"}
                isUppercase={true}
              >
                View on map
              </CustomText>
            </Button> */}

            <Row
              style={{
                width: "100%",
                border: "1px solid var(--border)",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  background: "var(--gray-mid)",
                  padding: "10px 20px",
                  textAlign: "center",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                }}
              >
                <CustomText size={"22px"} weight={"600"} color={"var(--white)"}>
                  - Booking -
                </CustomText>
              </Col>
              <Row
                style={{
                  width: "100%",
                  padding: "30px",
                  background: "var(--white)",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                }}
              >
                {/* Depart */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={24}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faCalendar}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-text)",
                          marginRight: "5px",
                        }}
                      />
                      Depart at
                    </CustomText>

                    <Input size="lagre" value={tour?.depart} readOnly />
                  </Col>

                  <Col
                    xl={24}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-text)",
                          marginRight: "5px",
                        }}
                      />
                      Start Time
                    </CustomText>
                    <Select
                      onChange={onChangeStartTime}
                      placeholder="Select start time"
                    >
                      {dataStartTimes?.map((item, index) => (
                        <Option size="middle" key={index} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>

                    {errorStartTime && (
                      <CustomText
                        size={"14px"}
                        weight={"400"}
                        color={"var(--red)"}
                      >
                        {errorStartTime}
                      </CustomText>
                    )}
                  </Col>
                </Row>

                {/* Adults, children and baby */}
                <Row
                  style={{
                    width: "100%",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    xl={7}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Adults{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.adults}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={1}
                      min={1}
                      max={tour?.adults}
                      onChange={onChangeAdults}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>

                  <Col
                    xl={7}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faChild}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Children{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.children}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={0}
                      min={0}
                      max={tour?.children}
                      onChange={onChangeChildren}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>

                  <Col
                    xl={7}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      <FontAwesomeIcon
                        icon={faPersonBreastfeeding}
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-light)",
                          marginRight: "5px",
                        }}
                      />
                      Baby{" "}
                      <CustomText
                        size={"13px"}
                        weight={"500"}
                        color={"var(--pink)"}
                      >
                        {"("}
                        {tour?.baby}
                        {")"}
                      </CustomText>
                    </CustomText>

                    <InputNumber
                      size="lagre"
                      defaultValue={0}
                      min={0}
                      max={tour?.baby}
                      onChange={onChangeBaby}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Col>
                </Row>

                {/* Adults */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Adults ({quantityAdults} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.priceAdult - tour?.discount)}
                      )
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        quantityAdults * (tour?.priceAdult - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Children */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Children ({quantityChildren} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.priceChild - tour?.discount)}
                      )
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        quantityChildren * (tour?.priceChild - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Baby */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Baby (
                      {tour?.priceBaby === 0
                        ? "Free"
                        : `${quantityBaby} x ${new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(tour?.priceBaby - tour?.discount)}`}
                      )
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        quantityBaby *
                          (tour?.priceBaby === 0
                            ? tour?.priceBaby
                            : tour?.priceBaby - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                {/* Discount */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderTop: "1px solid var(--border)",
                    borderBottom: "1px solid var(--border)",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      Discount
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"14px"}
                      weight={"400"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour?.discount)}
                    </CustomText>
                  </Col>
                </Row>

                {/* Total amount */}
                <Row
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                  justify={"space-between"}
                >
                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"16px"}
                      weight={"600"}
                      color={"var(--gray-text)"}
                    >
                      Total amount
                    </CustomText>
                  </Col>

                  <Col
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <CustomText
                      size={"16px"}
                      weight={"600"}
                      color={"var(--gray-text)"}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        quantityAdults * (tour?.priceAdult - tour?.discount) +
                          quantityChildren *
                            (tour?.priceChild - tour?.discount) +
                          quantityBaby *
                            (tour?.priceBaby === 0
                              ? tour?.priceBaby
                              : tour?.priceBaby - tour?.discount)
                      )}
                    </CustomText>
                  </Col>
                </Row>

                <Button
                  htmlType="submit"
                  size="large"
                  className="hover-button"
                  onClick={() => handleNavigateCheckout(tour?.id)}
                  style={{
                    width: "100%",
                    background: "var(--green-dark)",
                    border: "var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--white)"}
                    isButton={true}
                    isUppercase={true}
                  >
                    Book now
                  </CustomText>
                </Button>

                <Button
                  size="large"
                  // className="hover-button"
                  style={{
                    width: "100%",
                    background: "var(--white)",
                    border: "2px solid var(--green-dark)",
                    color: "var(--white)",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddWishlist(tour?.id)}
                >
                  <CustomText
                    size={"14px"}
                    weight={"600"}
                    color={"var(--green-dark)"}
                    isButton={true}
                    isUppercase={true}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        marginRight: "5px",
                      }}
                    />
                    Add to whislist
                  </CustomText>
                </Button>
              </Row>
            </Row>

            <Row
              style={{
                width: "100%",
                border: "1px solid var(--border)",
              }}
            >
              <Col
                style={{
                  width: "100%",
                  padding: "30px",
                  background: "var(--white)",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--gray-text)"}
                >
                  <FontAwesomeIcon
                    icon={faPhoneVolume}
                    style={{
                      fontSize: "52px",
                      color: "var(--pink)",
                    }}
                  />
                </CustomText>
                <CustomText
                  size={"20px"}
                  weight={"500"}
                  color={"var(--gray-text)"}
                >
                  Book my phone
                </CustomText>
                <CustomText
                  size={"26px"}
                  weight={"400"}
                  color={"var(--green-dark)"}
                >
                  +45 423 445 99
                </CustomText>
                <CustomText
                  size={"14px"}
                  weight={"400"}
                  color={"var(--black-text)"}
                >
                  Monday to Friday 9.00am - 7.30pm
                </CustomText>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>
    </>
  );
}
