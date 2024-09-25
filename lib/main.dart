import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/utils/authService.dart';
import 'package:keycrypt_desktop/utils/routes.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:sqflite_common_ffi/sqflite_ffi.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  databaseFactory = databaseFactoryFfi;

  await dotenv.load(fileName: '.env');

  bool isAuthorized;
  try {
    AuthService auth = AuthService();
    isAuthorized = await auth.isUserAuthorized();
  } catch (e) {
    // Log or handle the error as needed
    print(e);
    isAuthorized = false; // Default to unauthorized if there's an error
  }

  runApp(KeyCrypt(isAuthorized: isAuthorized));
}

class KeyCrypt extends StatelessWidget {
  final dynamic isAuthorized;

  const KeyCrypt({Key? key, required this.isAuthorized});

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
      home: isAuthorized ? Homepage() : LoginPage(),
      routes: {
        MyRoutes.loginPageRoute: (context) => const LoginPage(),
        MyRoutes.homePageRoute: (context) => Homepage(),
      },
    );
  }
}
