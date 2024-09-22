import 'dart:io';

import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/utils/routes.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:sqflite_common_ffi/sqflite_ffi.dart';

Future<void> main() async {
  databaseFactory = databaseFactoryFfi;
  print('Current working directory: ${Directory.current.path}');
  const envFilePath = "/home/viking/Code/keycrypt_desktop/.env";

  if (File(envFilePath).existsSync()) {
    print(".env file found at $envFilePath, loading...");
    await dotenv.load(fileName: envFilePath);
  } else {
    print("Error: .env file not found at $envFilePath");
  }

  runApp(const KeyCrypt());
}

class KeyCrypt extends StatelessWidget {
  const KeyCrypt({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: Color(0xFF111518),
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
