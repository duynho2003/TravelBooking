export const BASE_URL = "http://localhost:5050/api/";

export const API_ROUTE = {
  // Auth
  REGISTER: "v1/auth/register",

  LOGIN: "v1/auth/login",

  LOGOUT: "v1/auth/logout",

  // Website

  GET_WEBSITE_INFO: "v1/websites/",

  // Users
  GET_ALL_USERS: "v1/users",

  GET_USER_BY_ID: "v1/users/",

  CREATE_USER: "v1/users",

  UPDATE_USER: "v1/users/",

  DELETE_USER: "v1/users/",

  // Regions
  GET_ALL_REGIONS: "v1/regions",

  GET_REGION_BY_ID: "v1/regions/",

  CREATE_REGION: "v1/regions",

  UPDATE_REGION: "v1/regions/",

  // Provinces
  GET_ALL_PROVINCES: "v1/provinces",

  // Tours
  GET_ALL_TOURS: "v1/tours",

  GET_TOUR_BY_ID: "v1/tours/",

  DELETE_TOUR: "v1/tours/",

  // Hotels
  GET_ALL_HOTELS: "v1/hotels",

  GET_HOTEL_BY_ID: "v1/hotels/",

  UPDATE_HOTEL: "v1/hotels/",

  DELETE_HOTEL: "v1/hotels/",

  // Rooms
  CREATE_ROOM: "v1/rooms/hotels/",

  GET_ROOM_BY_ID: "v1/rooms/",

  UPDATE_ROOM: "v1/rooms/",

  DELETE_ROOM: "v1/rooms/",

  // Tour Room Booking
  TOUR_ROOM_BOOKING: "/v1/tourRoomBookings/create",

  // Booking
  GET_ALL_TOUR_BOOKINGS: "/v1/tourBookings",

  GET_ALL_ROOM_BOOKINGS: "/v1/roomBookings",

  // Transactions
  GET_ALL_TRANSACTIONS: "v1/transactions",
};

export const GOONG_MAP_KEY = "RPTXmcQEy2r3meEHOZFZ3B5L7u68a8YO5XF9pAuM";

export const API_KEY = "SCaIqymW5vCSNG158cOMc3VYYi6HOlsLCjfKwBgL";
