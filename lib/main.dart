import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/service/authService.dart';
import 'package:keycrypt_desktop/utils/authChecker.dart';
import 'package:keycrypt_desktop/utils/routes.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:sqflite_common_ffi/sqflite_ffi.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  databaseFactory = databaseFactoryFfi;

  await dotenv.load(fileName: '.env');
  runApp(KeyCrypt());
}

class KeyCrypt extends StatelessWidget {
  final AuthService authService = AuthService();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFF111518),
        textTheme: const TextTheme(
          bodyMedium: TextStyle(color: Color(0xFFFFFFFF)),
          bodyLarge: TextStyle(color: Color(0xFFFFFFFF)),
        ),
      ),
      home: AuthChecker(authService: authService),
      routes: {
        MyRoutes.loginPageRoute: (context) => const LoginPage(),
        MyRoutes.homePageRoute: (context) => const Homepage(),
      },
    );
  }
}
