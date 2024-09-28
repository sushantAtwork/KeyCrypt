import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/service/authService.dart';

class AuthChecker extends StatelessWidget {
  final AuthService authService;

  AuthChecker({required this.authService});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: authService.isUserAuthorized(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation(Colors.amberAccent),
                    backgroundColor: Colors.blueAccent,
                  ),
                ),
                SizedBox(
                  height: 20,
                ),
                Text('Logging Out...')
              ],
            ),
          );
        } else if (snapshot.hasData && snapshot.data == false) {
          // User is not authenticated, log them out and redirect.
          authService.logout(false);
          return LoginPage(); // Replace with your login screen.
        }
        // If authenticated, proceed to the main app or home screen.
        return Homepage(); // Replace with your home screen.
      },
    );
  }
}
