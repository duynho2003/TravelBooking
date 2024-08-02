import 'package:flutter/material.dart';
import 'package:jwt_decoder/jwt_decoder.dart';

class AuthProvider with ChangeNotifier {
  String _token = '';
  String _username = '';

  String get token => _token;
  String get username => _username;
  bool get isAuthenticated => _token.isNotEmpty;

  void setToken(String token) {
    _token = token;
    notifyListeners();
  }

  void setUsername(String username) {
    _username = username;
    notifyListeners();
  }

  void logout() {
    _token = '';
    _username = '';
    notifyListeners();
  }

  int get userId {
    if (_token.isNotEmpty) {
      Map<String, dynamic> payload = JwtDecoder.decode(_token);
      return payload['id'];
    }
    return 0;
  }
}
