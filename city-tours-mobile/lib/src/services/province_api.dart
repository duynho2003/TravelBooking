import 'dart:convert';
import 'package:flutter_application_1/src/models/province_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/utils/constants.dart';

class ProvinceApi {
  Future<List<Province>> fetchProvinces({
    int limit = 4,
  }) async {
    final url = Uri.parse('${URI.GET_ALL_PROVINCES_MOBILE}?limit=$limit');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final List<dynamic>? provinceData = responseData['data']['data'];

        if (provinceData != null) {
          return provinceData.map((json) => Province.fromJson(json)).toList();
        } else {
          throw Exception('No province data available');
        }
      } else {
        throw Exception('Failed to load provinces');
      }
    } catch (e) {
      throw Exception('Failed to fetch provinces: $e');
    }
  }
}
