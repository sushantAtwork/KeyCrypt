import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class AuthService {
  // String? _token;
  final _storage = FlutterSecureStorage();

  Future<bool> isUserAuthorized() async {
    final baseUrl = dotenv.env['BASE_URL'];

    if (baseUrl == null) {
      throw 'Base URL is not defined in .env file';
    }

    final url = Uri.parse('$baseUrl/user/auth');

    const storage = FlutterSecureStorage();
    String? token = await storage.read(key: 'token');

    try {
      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(
            <String, String?>{'access_token': token, 'token_type': 'str'}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['response'] == true;
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        return false;
      }
    } catch (e) {
      print('Error occurred during authorization: $e');
      return false;
    }
  }

  void saveToken(String token) async {
    try {
      await _storage.write(key: 'token', value: token);
    } catch (e) {
      await _storage.delete(key: 'token');
    } finally {
      await _storage.write(key: 'token', value: token);
    }
  }

  Future<void> logout(bool value) async {
    try {
      if (value) {
        await _storage.delete(key: 'token');
        await _clearLocalDatabase();
      } else {
        await _storage.delete(key: 'token');
      }
    } catch (e) {
      print("Error during logout: $e");
    }
  }

  Future<void> _clearLocalDatabase() async {
    String path = join(await getDatabasesPath(), 'my_database.db');
    final database = await openDatabase('my_database.db');
    await database.delete('items');
  }
}
