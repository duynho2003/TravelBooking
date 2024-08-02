import 'dart:convert';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter_application_1/src/models/auth_model.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

class AuthApi {
  // Register
  Future<dynamic> register(
      String username, String email, String password) async {
    const url = URI.REGISTER_MOBILE;
    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
    final Map<String, dynamic> body = {
      'username': username,
      'email': email,
      'password': password,
      'roles': ['ROLE_CUSTOMER']
    };

    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );

    if (response.statusCode == 201) {
      final responseJson = jsonDecode(response.body)['data'];
      final auth = Auth.fromJson(responseJson);
      return auth;
    } else {
      final errorMessage = jsonDecode(response.body)['message'];
      throw errorMessage;
    }
  }

  // Login
  Future<dynamic> login(
      BuildContext context, String username, String password) async {
    const url = URI.LOGIN_MOBILE;
    final Map<String, String> headers = {
      'Content-Type': 'application/json; charset=UTF-8',
    };
    final Map<String, dynamic> body = {
      'username': username,
      'password': password,
    };

    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      final responseJson = jsonDecode(response.body);
      final token = responseJson['data']['token'];

      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      authProvider.setToken(token);
      authProvider.setUsername(username);
    } else {
      final errorMessage = jsonDecode(response.body)['message'];
      throw errorMessage;
    }
  }
}
