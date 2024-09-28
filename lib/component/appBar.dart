import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/component/snackBar.dart';
import 'package:keycrypt_desktop/pages/loginPage.dart';
import 'package:keycrypt_desktop/service/authService.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool isAuthenticated; // New parameter to determine authentication state
  final Function() onLogout; // Callback for logout action

  const CustomAppBar({
    super.key,
    required this.title,
    required this.isAuthenticated,
    required this.onLogout,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(title),
      actions: [
        if (isAuthenticated) 
          IconButton(
            icon: const Icon(
              Icons.person,
              color: Colors.red,
            ),
            onPressed: () {
              _showDialog(context);
            },
          ),
        if (isAuthenticated)
          IconButton(
            icon: const Icon(Icons.logout_rounded),
            onPressed: () {
              _logout(context);
            },
          ),
      ],
      backgroundColor: Colors.blue,
    );
  }

  Future<void> _logout(BuildContext context) async {
    try {
      AuthService authService = AuthService();
      await authService.logout(true);
      onLogout();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginPage()),
      );
    } catch (e) {
      print('$e');
    } finally {
      showCustomSnackbar(context, 'Logged out successfully', Colors.deepPurple);
    }
  }

  void _showDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          child: SizedBox(
            width: 300,
            height: 200,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Dialog Content',
                  style: TextStyle(color: Colors.black),
                ),
                const Text(
                  'Name',
                  style: TextStyle(color: Colors.black),
                ),
                const Text(
                  'Email',
                  style: TextStyle(color: Colors.black),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('Close'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
