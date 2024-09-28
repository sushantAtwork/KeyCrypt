import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<String?> createKey(
    String keyName, String keyValue, String keyType) async {
  final baseUrl = dotenv.env['BASE_URL'];

  if (baseUrl == null) {
    return 'Base URL is not defined in .env file';
  }

  final url = Uri.parse('$baseUrl/user/add/key/');
  const storage = FlutterSecureStorage();
  String? token = await storage.read(key: 'token');

  try {
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode(
          <String, String>{'key': keyName, 'value': keyValue, 'type': keyType}),
    );

    // Log the response body
    print('Response body: ${response.body}');

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
      print(data['response']);
      // return jsonEncode(data['response']);
    }
  } catch (e) {
    return 'Error occurred during login: $e';
  }
}
