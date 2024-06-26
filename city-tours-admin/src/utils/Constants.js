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

  // Old routes

  GET_USER_BY_ID: "v1/users/",

  GET_TEACHER_BY_ID: "v1/teachers/",

  GET_COURSES_BY_TEACHER_ID: "v1/courses/teacher",

  APPROVED_REGISTER_TEACHER: "v1/users/approve-register-teacher/",

  APPROVED_OPEN_COURSE: "v1/courses/approve",

  UPLOAD_PROFILE_TEACHER: "v1/teachers/upload-profile/",

  GET_ALL_COURSES: "v1/courses/all",

  GET_COURSE_BY_ID: "v1/courses/",

  GET_ALL_LECTURES: "v1/lectures/all",

  GET_ALL_LECTURES_BY_USERID: "v1/lectures/teacher/",

  GET_ALL_TRANSACTIONS: "v1/transactions/all",

  APPROVED_CREATE_LECTURE: "v1/lectures/approve",

  DEPOSIT_TRANSACTION: "v1/transactions/deposit",

  WITHDRAW_TRANSACTION: "v1/transactions/withdraw",

  APPROVED_DEPOSIT_TRANSACTION: "v1/transactions/deposit/",

  APPROVED_WITHDRAW_TRANSACTION: "v1/transactions/withdraw/",

  BUY_COURSE: "v1/enrollments/buy-course",

  GET_ALL_COURSES_OF_ENROLLMENT: "v1/enrollments/courses/",

  GET_ALL_LECTURES_OF_ENROLLMENT_BY_COURSE_ID: "v1/lectures/courses/",

  GET_ALL_BANKS: "https://api.vietqr.io/v2/banks",

  CREATE_REVIEW: "v1/reviews/create",

  GET_ALL_REVIEW_BY_COURSE_ID: "v1/reviews/",
};
