import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/room_booking_customer_model.dart';
// import 'package:flutter_application_1/src/models/tour_booking_customer_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class RoomBookingApi {
  Future<Map<String, dynamic>> createRoomBooking({
    required BuildContext context,
    required int userId,
    required int roomId,
    required String startDate,
    required String endDate,
    required double price,
    required String roomType,
    required String roomNumber,
    required String hotelName,
  }) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final url = Uri.parse(URI.CREATE_ROOM_BOOKING_MOBILE);

    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };

    final Map<String, dynamic> body = {
      'userId': userId,
      'roomId': roomId,
      'startDate': startDate,
      'endDate': endDate,
      'price': price,
      'roomType': roomType,
      'roomNumber': roomNumber,
      'hotelName': hotelName,
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
        throw Exception('Failed to create room booking: $errorMessage');
      }
    } catch (e) {
      print('Exception in createRoomBooking: $e');
      throw Exception('An error occurred while creating the room booking: $e');
    }
  }

  // Get all room bookings by userId
  Future<List<RoomBookingCustomer>> fetchRoomBookingsByUserId({
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
        '${URI.GET_ALL_ROOM_BOOKINGS_BY_USERID_MOBILE}$userId?page=$page&limit=$limit');

    // In URL để kiểm tra giá trị
    print('Fetching room bookings from URL: $url');

    try {
      final response = await http.get(url, headers: headers);

      // In mã trạng thái của phản hồi
      print('Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        // In nội dung phản hồi
        print('Response body: ${response.body}');

        final List<dynamic>? roomBookingsData = responseData['data']?['data'];

        if (roomBookingsData != null) {
          // In số lượng tour bookings được trả về
          print('Number of tours received: ${roomBookingsData.length}');

          return roomBookingsData
              .map((json) => RoomBookingCustomer.fromJson(json))
              .toList();
        } else {
          throw Exception('No room data available');
        }
      } else {
        throw Exception('Failed to load rooms');
      }
    } catch (e) {
      // In thông báo lỗi
      print('Error: $e');
      throw Exception('Failed to fetch rooms: $e');
    }
  }
}
