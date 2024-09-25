import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:keycrypt_desktop/utils/authService.dart';

Future<String?> loginUser(String? username, String? password) async {
  final baseUrl = dotenv.env['BASE_URL'];

  if (baseUrl == null) {
    return 'Base URL is not defined in .env file';
  }

  if (username == null || password == null) {
    return 'Username or password cannot be null';
  }

  final url = Uri.parse('$baseUrl/user/login');

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': username,
        'password': password,
      }),
    );

    if (response.statusCode != 200) {
      String? data = '';
      switch (response.statusCode) {
        case 400:
          data = '!!Invalid Credential!!';
          break;

        case 500:
          data = '!!Server Error!!';
          break;
      }
      return data;
    } else {
      final data = jsonDecode(response.body);
      print(data['token']);
      AuthService authService = AuthService();
      authService.saveToken(data['token']);
      return data['token'];
    }
  } catch (e) {
    // Catch any other errors (e.g., network issues)
    return 'Error occurred during login: $e';
  }
}
