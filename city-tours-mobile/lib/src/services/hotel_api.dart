import 'dart:convert';
import 'package:flutter_application_1/src/models/hotel_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/utils/constants.dart';

class HotelApi {
  Future<List<Hotel>> fetchHotels({
    int page = 1,
    int limit = 4,
    String review = '',
    String rating = 'decrement',
  }) async {
    final url = Uri.parse(
        '${URI.GET_ALL_HOTELS_MOBILE}?page=$page&limit=$limit&review=$review&rating=$rating');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final List<dynamic>? tourData = responseData['data']['data'];

        if (tourData != null) {
          return tourData.map((json) => Hotel.fromJson(json)).toList();
        } else {
          throw Exception('No hotel data available');
        }
      } else {
        throw Exception('Failed to load hotels');
      }
    } catch (e) {
      throw Exception('Failed to fetch hotels: $e');
    }
  }

  Future<Hotel> getHotelById({required int hotelId}) async {
    final url = Uri.parse('${URI.GET_HOTEL_BY_ID_MOBILE}$hotelId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final Map<String, dynamic>? hotelData = responseData['data'];

        if (hotelData != null) {
          return Hotel.fromJson(hotelData);
        } else {
          throw Exception('No hotel data found');
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        final String errorMessage =
            errorData['message'] ?? 'Failed to load hotel';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Failed to fetch hotel: $e');
    }
  }
}
