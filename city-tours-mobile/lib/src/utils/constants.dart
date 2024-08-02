import 'package:flutter/material.dart';

class AppColors {
  static const Color blackText = Color(0xFF333333);
  static const Color grayText = Color(0xFF2A2A2A);
  static const Color red = Color(0xFFE04F67);
  static const Color greenDark = Color(0xFF008489);
  static const Color footer = Color(0xFF222222);
  static const Color yellowLight = Color(0xFFFDF7AC);
  static const Color grayLight = Color(0xFF7B7B7B);
  static const Color grayDark = Color(0xFF434343);
  static const Color bgGrayLight = Color(0xFFF9F9F9);
  static const Color white = Color(0xFFFFFFFF);
  static const Color pink = Color(0xFFE14D67);
  static const Color blueLight = Color(0xFF33CCFF);
  static const Color border = Color(0xFFF0F0F0);
  static const Color orange = Color(0xFFFF9900);
  static const Color grayMid = Color(0xFF565A5C);
  static const LinearGradient linearGradientBackground = LinearGradient(
    begin: Alignment.bottomCenter,
    end: Alignment.topCenter,
    colors: [
      Color(0xFF000000),
      Color(0x1A000000),
    ],
  );
}

class URI {
  // Chrome
  static const String BASE_URL_CHROME = "http://localhost:5050/api/v1";
  // static const String BASE_URL_MOBILE = "http://127.0.0.1:5050/api/v1";
  static const String GET_ALL_PROVINCES_CHROME = '$BASE_URL_CHROME/provinces';
  static const String GET_ALL_TOURS_CHROME = '$BASE_URL_CHROME/tours';
  static const String GET_ALL_HOTELS_CHROME = '$BASE_URL_CHROME/hotels';
  static const String REGISTER_CHROME = '$BASE_URL_CHROME/auth/register';
  static const String LOGIN_CHROME = '$BASE_URL_CHROME/auth/login';
  static const String GET_PROFILE_CHROME = '$BASE_URL_CHROME/users/';
  static const String UPDATE_PROFILE_CHROME = '$BASE_URL_CHROME/customers/';
  static const String GET_TOUR_BY_ID_CHROME = '$BASE_URL_CHROME/tours/';
  static const String CREATE_TOUR_BOOKING_CHROME =
      '$BASE_URL_CHROME/tourBookings/create';
  static const String GET_ALL_TOUR_BOOKINGS_BY_USERID_CHROME =
      '$BASE_URL_CHROME/tourBookings/';
  static const String GET_ALL_TOUR_REVIEWS_BY_TOUR_ID_CHROME =
      '$BASE_URL_CHROME/tourReviews/';
  static const String CREATE_TOUR_REVIEW_CHROME =
      '$BASE_URL_CHROME/tourReviews/create';
  static const String GET_ALL_BLOGS_CHROME = '$BASE_URL_CHROME/blogs';
  static const String GET_BLOG_BY_ID_CHROME = '$BASE_URL_CHROME/blogs/';

  // Mobile
  static const String BASE_URL_MOBILE = "http://10.0.2.2:5050/api/v1";

  static const String GET_ALL_PROVINCES_MOBILE = '$BASE_URL_MOBILE/provinces';
  static const String GET_ALL_TOURS_MOBILE = '$BASE_URL_MOBILE/tours';
  static const String GET_ALL_HOTELS_MOBILE = '$BASE_URL_MOBILE/hotels';
  static const String REGISTER_MOBILE = '$BASE_URL_MOBILE/auth/register';
  static const String LOGIN_MOBILE = '$BASE_URL_MOBILE/auth/login';
  static const String GET_PROFILE_MOBILE = '$BASE_URL_MOBILE/users/';
  static const String UPDATE_PROFILE_MOBILE = '$BASE_URL_MOBILE/customers/';
  static const String GET_TOUR_BY_ID_MOBILE = '$BASE_URL_MOBILE/tours/';
  static const String CREATE_TOUR_BOOKING_MOBILE =
      '$BASE_URL_MOBILE/tourBookings/create';
  static const String GET_ALL_TOUR_BOOKINGS_BY_USERID_MOBILE =
      '$BASE_URL_MOBILE/tourBookings/';
  static const String GET_ALL_TOUR_REVIEWS_BY_TOUR_ID_MOBILE =
      '$BASE_URL_MOBILE/tourReviews/';
  static const String CREATE_TOUR_REVIEW_MOBILE =
      '$BASE_URL_MOBILE/tourReviews/create';
  static const String GET_ALL_BLOGS_MOBILE = '$BASE_URL_MOBILE/blogs';
  static const String GET_BLOG_BY_ID_MOBILE = '$BASE_URL_MOBILE/blogs/';
}
