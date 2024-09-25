import 'dart:io';

import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/utils/routes.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  databaseFactory = databaseFactoryFfi;

  await dotenv.load(fileName: '.env');

  // Now you can use the environment variables
  print(dotenv.env['BASE_URL']);

  runApp(const KeyCrypt());
}

class KeyCrypt extends StatelessWidget {
  const KeyCrypt({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFF111518),
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Color(0xFFFFFFFF)),
          bodyLarge: TextStyle(color: Color(0xFFFFFFFF)), // Default text color
          // Default text color
        ),
      ),
      initialRoute: "/login",
      routes: {
        MyRoutes.loginPageRoute: (context) => const LoginPage(),
        MyRoutes.homePageRoute: (context) => const Homepage(data: ''),
      },
    );
  }
}
