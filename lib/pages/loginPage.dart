import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/pages/homePage.dart';
import '../service/loginApi.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _message = '';
  String _token = '';

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _message = ''; // Reset the message before the login attempt
      });

      String? username = _emailController.text;
      String? password = _passwordController.text;

      LoginUser loginUser = LoginUser();
      String? message = await loginUser.loginUser(username, password);

      setState(() {
        if (message != null && !message.contains('!')) {
          _token = message;
          _message = 'Login successful';
        } else {
          _message = 'Error: $message';
        }
      });

      if (_message == 'Login successful') {
        // Show success SnackBar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(_message)),
        );

        // Navigate to the next page after a short delay
        await Future.delayed(
            const Duration(seconds: 1)); // Optional: allow SnackBar to be visible
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => Homepage(data: _token)),
        );
      } else {
        // Show error SnackBar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(_message)),
        );
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login Page'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  _login();
                },
                child: const Text('Login'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
