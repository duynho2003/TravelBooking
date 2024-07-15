export const BASE_URL = "http://localhost:5050/api/";

export const API_ROUTE = {
  // Auth
  REGISTER: "v1/auth/register",

  LOGIN: "v1/auth/login",

  LOGOUT: "v1/auth/logout",

  // Users
  GET_ALL_USERS: "v1/users",

  GET_USER_BY_ID: "v1/users/",

  CREATE_USER: "v1/users",

  UPDATE_USER: "v1/users/",

  DELETE_USER: "v1/users/",

  // Tour Room Booking
  TOUR_ROOM_BOOKING: "/v1/tourRoomBookings/create",

  // Booking
  GET_ALL_TOUR_BOOKINGS: "/v1/tourBookings",

  GET_ALL_ROOM_BOOKINGS: "/v1/roomBookings",

  // Transactions
  GET_ALL_TRANSACTIONS: "v1/transactions",
};
