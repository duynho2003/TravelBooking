import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:provider/provider.dart';

class RoomCheckoutSuccess extends StatefulWidget {
  final Map<String, dynamic>? bookingData;
  const RoomCheckoutSuccess({super.key, this.bookingData});

  @override
  State<RoomCheckoutSuccess> createState() => _RoomCheckoutSuccessState();
}

class _RoomCheckoutSuccessState extends State<RoomCheckoutSuccess> {
  int _selectedIndex = 2;

  void _onItemTapped(int index) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/hotels_list');
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

  @override
  Widget build(BuildContext context) {
    debugPrint('Booking Data: ${widget.bookingData}');

    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: SingleChildScrollView(
          child: Container(
              color: AppColors.white,
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.check_circle_outline,
                      size: 80,
                      color: AppColors.greenDark,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Booking Successful!',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.grayText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Thank you for your purchase',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.grayText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      'Your booking has been successfully processed.',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.grayText,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 30),
                    _buildOrderDetails(widget.bookingData),
                    const SizedBox(height: 20),
                    _buildNextActions(context),
                  ],
                ),
              ))),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildOrderDetails(Map<String, dynamic>? bookingData) {
    if (bookingData == null) {
      return Container();
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Booking details',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.grayText,
            ),
          ),
          const SizedBox(height: 10),
          _buildOrderDetailRow('Room Info', bookingData['roomInfo'] ?? 'N/A'),
          _buildOrderDetailRow('Total Amount',
              formatCurrency(bookingData['totalAmount']) ?? 'N/A'),
          _buildOrderDetailRow(
              'Payment Status', bookingData['paymentStatus'] ?? 'N/A'),
        ],
      ),
    );
  }

  Widget _buildOrderDetailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.grayDark,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.grayText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNextActions(BuildContext context) {
    return Column(
      children: [
        CustomButton(
          backgroundColor: AppColors.greenDark,
          textColor: AppColors.white,
          text: 'Go to home',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: FontWeight.bold,
          paddingTop: 20,
          paddingBottom: 20,
          onPressed: () {
            Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
          },
        ),
        const SizedBox(height: 10),
        CustomButton(
          backgroundColor: AppColors.white,
          textColor: AppColors.greenDark,
          text: 'View booking details',
          borderRadius: 20,
          fontSize: 14,
          fontWeight: FontWeight.bold,
          paddingTop: 20,
          paddingBottom: 20,
          onPressed: () {
            Navigator.pushNamed(context, '/room_bookings');
          },
        ),
      ],
    );
  }
}
