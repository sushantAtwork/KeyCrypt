// custom_snackbar.dart

import 'package:flutter/material.dart';

void showCustomSnackbar(BuildContext context, String message, Color backgroundColor) {
  final snackBar = SnackBar(
    content: Text(message),
    backgroundColor: backgroundColor,
    duration: const Duration(seconds: 3), // Duration for how long the snackbar is displayed
    behavior: SnackBarBehavior.floating, // Optional: Change the behavior
    margin: const EdgeInsets.all(16), // Optional: Adjust margin
  );

  ScaffoldMessenger.of(context).showSnackBar(snackBar);
}
