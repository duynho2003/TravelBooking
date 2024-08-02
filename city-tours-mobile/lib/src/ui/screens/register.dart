import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/services/auth_api.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/utils/validators.dart';

class Register extends StatefulWidget {
  const Register({super.key});

  @override
  State<Register> createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    if (_formKey.currentState?.validate() ?? false) {
      final String username = _usernameController.text;
      final String email = _emailController.text;
      final String password = _passwordController.text;
      final String confirmPassword = _confirmPasswordController.text;

      if (password != confirmPassword) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Password Mismatch'),
              content:
                  const Text('The passwords do not match. Please try again.'),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
        return;
      }

      try {
        final AuthApi authApi = AuthApi();
        final auth = await authApi.register(username, email, password);
        print('Registration successful with: ${auth.username}');
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Registration Successful'),
              content: Text('Registration successful for ${auth.username}'),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    Navigator.pushReplacementNamed(context, '/login');
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      } catch (e) {
        String errorMessage = e.toString();
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Registration Failed'),
              content: Text(errorMessage),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/images/bg-register.webp'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          // Registration form
          Center(
            child: Container(
              padding: const EdgeInsets.only(
                  top: 40, right: 20, bottom: 40, left: 20),
              margin: const EdgeInsets.symmetric(horizontal: 20),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    InkWell(
                      onTap: () {
                        Navigator.pushNamed(context, '/');
                      },
                      child: Column(
                        children: [
                          Image.asset(
                            'assets/images/logo.png',
                            height: 30,
                            fit: BoxFit.cover,
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            'Create a new account',
                            style: TextStyle(fontSize: 16),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _usernameController,
                      decoration: const InputDecoration(
                        labelText: 'Username',
                        labelStyle: TextStyle(fontSize: 14),
                        enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: AppColors.grayLight)),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppColors.pink),
                        ),
                      ),
                      style: const TextStyle(
                          fontSize: 14, color: AppColors.grayLight),
                      validator: (value) =>
                          Validator.validateNotEmpty(value ?? ''),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _emailController,
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        labelStyle: TextStyle(fontSize: 14),
                        enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: AppColors.grayLight)),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppColors.pink),
                        ),
                      ),
                      style: const TextStyle(
                          fontSize: 14, color: AppColors.grayLight),
                      validator: (value) =>
                          Validator.validateEmail(value ?? ''),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _passwordController,
                      decoration: const InputDecoration(
                        labelText: 'Password',
                        labelStyle: TextStyle(fontSize: 14),
                        enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: AppColors.grayLight)),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppColors.pink),
                        ),
                      ),
                      style: const TextStyle(
                          fontSize: 14, color: AppColors.grayLight),
                      validator: (value) =>
                          Validator.validateNotEmpty(value ?? ''),
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _confirmPasswordController,
                      decoration: const InputDecoration(
                        labelText: 'Confirm Password',
                        labelStyle: TextStyle(fontSize: 14),
                        enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: AppColors.grayLight)),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppColors.pink),
                        ),
                      ),
                      style: const TextStyle(
                          fontSize: 14, color: AppColors.grayLight),
                      validator: (value) =>
                          Validator.validateNotEmpty(value ?? ''),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: CustomButton(
                        backgroundColor: AppColors.greenDark,
                        textColor: AppColors.white,
                        text: 'Create an account',
                        hoverColor: Colors.lightBlue,
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        onPressed: _handleRegister,
                        paddingTop: 20,
                        paddingBottom: 20,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
