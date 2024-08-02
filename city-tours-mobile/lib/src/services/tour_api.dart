import 'dart:convert';
import 'package:flutter_application_1/src/models/tour_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/utils/constants.dart';

class TourApi {
  // Get all tours
  Future<List<Tour>> fetchTours(
      {int page = 1,
      int limit = 4,
      String startPrice = '0',
      String endPrice = '50000000',
      String rating = 'increment',
      String review = '',
      String depart = '',
      String startDate = '',
      String completed = 'false'}) async {
    final url = Uri.parse(
        '${URI.GET_ALL_TOURS_MOBILE}?page=$page&limit=$limit&startPrice=$startPrice&endPrice=$endPrice&rating=$rating&review=$review&depart=$depart&startDate=$startDate&completed=$completed');

    // In URL để kiểm tra giá trị
    print('Fetching tours from URL: $url');

    try {
      final response = await http.get(url);

      // In mã trạng thái của phản hồi
      print('Response status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        // In nội dung phản hồi
        print('Response body: ${response.body}');

        final List<dynamic>? tourData = responseData['data']['data'];

        if (tourData != null) {
          // In số lượng tour được trả về
          print('Number of tours received: ${tourData.length}');

          return tourData.map((json) => Tour.fromJson(json)).toList();
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

  // Get tour by id
  Future<Tour> getTourById({required int tourId}) async {
    final url = Uri.parse('${URI.GET_TOUR_BY_ID_MOBILE}$tourId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final Map<String, dynamic>? tourData = responseData['data'];

        if (tourData != null) {
          return Tour.fromJson(tourData);
        } else {
          // Handle the case where tourData is null
          throw Exception('No tour data found');
        }
      } else {
        // Handle the case where the response status code is not 200
        final Map<String, dynamic> errorData = json.decode(response.body);
        final String errorMessage =
            errorData['message'] ?? 'Failed to load tour';
        throw Exception(errorMessage);
      }
    } catch (e) {
      // Handle any exceptions that occur during the request or data processing
      throw Exception('Failed to fetch tour: $e');
    }
  }
}
