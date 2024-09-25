import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  // Simulated token for demonstration. Replace with your actual logic.
  String? _token;

  Future<bool> isUserAuthorized() async {
    final baseUrl = dotenv.env['BASE_URL'];

    if (baseUrl == null) {
      throw 'Base URL is not defined in .env file';
    }

    final url = Uri.parse('$baseUrl/user/isAuthorized');

    final storage = const FlutterSecureStorage();
    String? token = await storage.read(key: 'token');
    String? data = '';
    try {
      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(<String, String?>{
          'token': token,
        }),
      );

      if (response.statusCode != 200) {
        switch (response.statusCode) {
          case 500:
            data = '!!Server Error!!';
            break;
        }
        return false;
      }
    } catch (e) {
      // Catch any other errors (e.g., network issues)
      throw '$data : Error occurred during login: $e';
    }
    return true;
  }

  void saveToken(String token) async {
    final storage = const FlutterSecureStorage();
    try {
      await storage.write(key: 'token', value: token);
    } catch (e) {
      await storage.delete(key: 'token');
    } finally {
      await storage.write(key: 'token', value: token);
    }
  }
}
