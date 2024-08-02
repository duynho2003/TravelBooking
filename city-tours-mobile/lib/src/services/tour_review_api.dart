import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_review_model.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class TourReviewApi {
  Future<List<TourReview>> fetchTourReviews({
    required int tourId,
    int page = 1,
    int limit = 4,
  }) async {
    final url = Uri.parse(
        '${URI.GET_ALL_TOUR_REVIEWS_BY_TOUR_ID_MOBILE}$tourId?page=$page&limit=$limit');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final List<dynamic>? tourReviewData = responseData['data']['data'];

        if (tourReviewData != null) {
          return tourReviewData
              .map((json) => TourReview.fromJson(json))
              .toList();
        } else {
          throw Exception('No tour review data available');
        }
      } else {
        throw Exception('Failed to load tour reviews');
      }
    } catch (e) {
      throw Exception('Failed to fetch tour reviews: $e');
    }
  }

  Future<String> createTourReview({
    required BuildContext context,
    required TourReview tourReview,
  }) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final url = Uri.parse('${URI.CREATE_TOUR_REVIEW_MOBILE}');
    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };

    final Map<String, dynamic> body = {
      'userId': tourReview.userId,
      'tourId': tourReview.tourId,
      'tourBookingId': tourReview.tourBookingId,
      'customerName': tourReview.customerName,
      'content': tourReview.content,
      'rating': tourReview.rating,
    };

    final String bodyJson = jsonEncode(body);

    try {
      // Print JSON to debug
      print('Request body: $body');

      final response = await http.post(
        url,
        headers: headers,
        body: bodyJson,
      );

      // Print response for debugging
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 201) {
        final responseJson = jsonDecode(response.body);
        final String message =
            responseJson['message'] ?? 'Review submitted successfully.';
        return message;
      } else {
        final responseJson = jsonDecode(response.body);
        final String message =
            responseJson['message'] ?? 'Failed to submit review.';
        throw Exception(message);
      }
    } catch (e) {
      // Print the error message for debugging
      print('Error: $e');
      return 'Failed to submit review: $e';
    }
  }
}
