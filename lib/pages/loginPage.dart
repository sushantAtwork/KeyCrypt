import 'package:flutter/material.dart';
import 'package:keycrypt_desktop/component/appBar.dart';
import 'package:keycrypt_desktop/component/snackBar.dart';
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

  Color _snackBarColor = Colors.grey;
  bool _isLoading = false;
  bool _isLoggedIn = false;

  void _refreshAuthState() {
    setState(() {
      _isLoggedIn = false;
    });
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _message = '';
        _isLoading = true;
      });

      String? username = _emailController.text;
      String? password = _passwordController.text;

      try {
        String? message = await loginUser(username, password);

        if (!mounted) return;

        setState(() {
          if (message != null && !message.contains('!')) {
            _token = message;
            _message = 'Login successful';
            _snackBarColor = Colors.green;
          } else {
            _message = 'Error: $message';
            _snackBarColor = Colors.red;
          }
        });

        if (_message == 'Login successful') {
          showCustomSnackbar(context, _message, _snackBarColor);
          if (!mounted) return;

          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const Homepage()),
          );
        } else {
          showCustomSnackbar(context, _message, _snackBarColor);
        }
      } catch (e) {
        if (!mounted) return; // Check again in case of an error

        setState(() {
          _message = 'An error occurred: $e';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(_message)),
        );
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
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
      appBar: CustomAppBar(
        title: 'Login Page',
        isAuthenticated: _isLoggedIn,
        onLogout: _refreshAuthState,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation(Colors.amberAccent),
                    backgroundColor: Colors.blueAccent,
                  ),
                )
              : Column(
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
