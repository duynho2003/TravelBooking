import 'dart:convert';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_application_1/src/models/user_model.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';

class UserApi {
  // Get profile by userId
  Future<UserModel> getProfileByUserId(BuildContext context, int userId) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final url = '${URI.GET_PROFILE_MOBILE}$userId';
    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };

    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );

    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      final responseJson = jsonDecode(response.body)['data'];
      final userModel = UserModel.fromJson(responseJson);
      return userModel;
    } else {
      final errorMessage = jsonDecode(response.body)['message'];
      throw errorMessage;
    }
  }

  // Update profile by userId
  Future<dynamic> updateProfileByUserId(BuildContext context, int userId,
      String name, String phone, String address) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final String token = authProvider.token;

    final url = '${URI.UPDATE_PROFILE_MOBILE}$userId';
    print(url);
    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer $token',
    };
    final Map<String, dynamic> body = {
      'name': name,
      'phone': phone,
      'address': address
    };

    final response = await http.put(Uri.parse(url),
        headers: headers, body: jsonEncode(body));

    if (response.statusCode == 201) {
      final responseJson = jsonDecode(response.body);
      final message = responseJson['message'];
      return message;
    } else {
      final errorMessage = jsonDecode(response.body)['message'];
      throw errorMessage;
    }
  }
}
