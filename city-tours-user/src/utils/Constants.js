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

  // Customer
  CREATE_CUSTOMER: "v1/customers",

  GET_INFO_CUSTOMER: "v1/users/",

  // Review
  CREATE_HOTEL_REVIEW: "v1/hotelReviews/create",

  GET_ALL_HOTEL_REVIEW: "v1/hotelReviews",

  GET_HOTEL_REVIEW_BY_HOTEL_ID: "v1/hotelReviews/",

  // Provinces
  GET_ALL_PROVINCES: "v1/provinces",
};
