import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_booking_customer_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class TourBookingApi {
  // Create tour booking
  Future<Map<String, dynamic>> createTourBooking({
    required BuildContext context,
    required int tourId,
    required int userId,
    required String startTime,
    required int adults,
    required int children,
    required int baby,
    required double amount,
    required String bookingStatus,
    required String paymentStatus,
  }) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final url = Uri.parse(URI.CREATE_TOUR_BOOKING_MOBILE);

    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };

    final Map<String, dynamic> body = {
      'tourId': tourId,
      'userId': userId,
      'startTime': startTime,
      'adults': adults,
      'children': children,
      'baby': baby,
      'amount': amount,
      'bookingStatus': bookingStatus,
      'paymentStatus': paymentStatus,
    };

    try {
      final response =
          await http.post(url, headers: headers, body: jsonEncode(body));

      // Log the response for debugging
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 201) {
        final responseJson = jsonDecode(response.body) as Map<String, dynamic>;

        // Check if 'data' exists and is a Map
        if (responseJson.containsKey('data') && responseJson['data'] is Map) {
          final data = responseJson['data'] as Map<String, dynamic>;
          return data;
        } else {
          throw 'Response does not contain expected data structure';
        }
      } else {
        final responseJson = jsonDecode(response.body) as Map<String, dynamic>;
        final errorMessage = responseJson['message'] ?? 'Unknown error';
        throw Exception('Failed to create tour booking: $errorMessage');
      }
    } catch (e) {
      print('Exception in createTourBooking: $e');
      throw Exception('An error occurred while creating the tour booking: $e');
    }
  }

  // Get all tour bookings by userId
  Future<List<TourBookingCustomer>> fetchTourBookingsByUserId({
    required BuildContext context,
    required int userId,
    int page = 1,
    int limit = 4,
  }) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };

    final url = Uri.parse(
        '${URI.GET_ALL_TOUR_BOOKINGS_BY_USERID_MOBILE}$userId?page=$page&limit=$limit');

    // In URL để kiểm tra giá trị
    print('Fetching tour bookings from URL: $url');

    try {
      final response = await http.get(url, headers: headers);

      // In mã trạng thái của phản hồi
      print('Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        // In nội dung phản hồi
        print('Response body: ${response.body}');

        final List<dynamic>? tourBookingsData = responseData['data']?['data'];

        if (tourBookingsData != null) {
          // In số lượng tour bookings được trả về
          print('Number of tours received: ${tourBookingsData.length}');

          return tourBookingsData
              .map((json) => TourBookingCustomer.fromJson(json))
              .toList();
        } else {
          throw Exception('No tour data available');
        }
      } else {
        throw Exception('Failed to load tours');
      }
    } catch (e) {
      // In thông báo lỗi
      print('Error: $e');
      throw Exception('Failed to fetch tours: $e');
    }
  }
}
