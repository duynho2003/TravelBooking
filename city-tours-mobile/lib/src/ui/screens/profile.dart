import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/services/user_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class Profile extends StatefulWidget {
  const Profile({super.key});

  @override
  State<Profile> createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();

  int _selectedIndex = 4;

  void _onItemTapped(int index) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/hotels');
        break;
      case 1:
        Navigator.pushNamed(context, '/tours_list');
        break;
      case 2:
        Navigator.pushNamed(context, '/');
        break;
      case 3:
        Navigator.pushNamed(context, '/blogs');
        break;
      case 4:
        if (authProvider.isAuthenticated) {
          Navigator.pushNamed(context, '/profile');
        } else {
          Navigator.pushNamed(context, '/login');
        }
        break;
    }
  }

  // Biến để lưu trạng thái ban đầu
  String _initialName = '';
  String _initialPhone = '';
  String _initialAddress = '';

  @override
  void initState() {
    super.initState();
    _fetchUserProfile();
  }

  Future<void> _fetchUserProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;
      final userApi = UserApi();

      final userModel = await userApi.getProfileByUserId(context, userId);

      // Cập nhật các TextEditingController với thông tin người dùng
      _usernameController.text = userModel.username;
      _emailController.text = userModel.email;
      _initialName = userModel.customer?.name ?? 'Chưa cập nhật';
      _initialPhone = userModel.customer?.phone ?? 'Chưa cập nhật';
      _initialAddress = userModel.customer?.address ?? 'Chưa cập nhật';

      _nameController.text = _initialName;
      _phoneController.text = _initialPhone;
      _addressController.text = _initialAddress;

      setState(() {});
    } catch (e) {
      // Xử lý lỗi nếu cần
      print('Failed to fetch user profile: $e');
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  void _updateInfo() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;

    final updatedName = _nameController.text;
    final updatedPhone = _phoneController.text;
    final updatedAddress = _addressController.text;

    // Kiểm tra nếu các trường khác với trạng thái ban đầu
    bool hasUpdates = updatedName != _initialName ||
        updatedPhone != _initialPhone ||
        updatedAddress != _initialAddress;

    if (hasUpdates) {
      try {
        final userApi = UserApi();
        final message = await userApi.updateProfileByUserId(
          context,
          userId,
          updatedName,
          updatedPhone,
          updatedAddress,
        );

        // Hiển thị thông báo thành công
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Update Successful'),
              content: Text(message),
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
      } catch (e) {
        print(e);
        // Hiển thị thông báo lỗi
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Update Failed'),
              content: Text('An error occurred: $e'),
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
    } else {
      print('No updates to show.');
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('No Changes'),
            content: const Text('There are no changes to update.'),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Profile Information',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            _buildTextField(_usernameController, 'Username', readOnly: true),
            const SizedBox(height: 20),
            _buildTextField(_emailController, 'Email', readOnly: true),
            const SizedBox(height: 20),
            _buildEditableTextField(_nameController, 'Full Name'),
            const SizedBox(height: 20),
            _buildEditableTextField(_phoneController, 'Phone Number'),
            const SizedBox(height: 20),
            _buildEditableTextField(_addressController, 'Address'),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: CustomButton(
                backgroundColor: AppColors.greenDark,
                textColor: AppColors.white,
                text: 'UPDATE INFO',
                hoverColor: Colors.lightBlue,
                borderRadius: 5,
                fontSize: 14,
                fontWeight: FontWeight.w600,
                onPressed: _updateInfo,
                paddingTop: 20,
                paddingBottom: 20,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label,
      {bool readOnly = false}) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 14),
        border: const OutlineInputBorder(),
      ),
      style: const TextStyle(fontSize: 14),
      readOnly: readOnly,
    );
  }

  Widget _buildEditableTextField(
      TextEditingController controller, String label) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(fontSize: 14),
        border: const OutlineInputBorder(),
        suffixIcon: const Icon(
          Icons.edit_note,
          color: AppColors.grayLight,
        ),
      ),
      style: const TextStyle(fontSize: 14),
    );
  }
}
