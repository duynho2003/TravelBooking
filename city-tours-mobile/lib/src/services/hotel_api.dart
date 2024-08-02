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
}
