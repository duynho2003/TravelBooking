import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_booking_model.dart';
import 'package:flutter_application_1/src/services/tour_booking_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/state/tour_booking_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:flutter_application_1/src/services/user_api.dart';

class TourCheckout extends StatefulWidget {
  const TourCheckout({super.key, required this.tourId});

  final int tourId;

  @override
  State<TourCheckout> createState() => _TourCheckoutState();
}

class _TourCheckoutState extends State<TourCheckout> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _startTimeController = TextEditingController();
  final _discountController = TextEditingController();
  final _totalAmountController = TextEditingController();

  String _initialName = '';
  String _initialPhone = '';
  String _initialAddress = '';

  @override
  void initState() {
    super.initState();
    _fetchUserProfile();
    _fetchAndSetBookingInfo();
  }

  Future<void> _fetchUserProfile() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.userId;
      final userApi = UserApi();

      final userModel = await userApi.getProfileByUserId(context, userId);

      setState(() {
        _initialName = userModel.customer?.name ?? 'Chưa cập nhật';
        _initialPhone = userModel.customer?.phone ?? 'Chưa cập nhật';
        _initialAddress = userModel.customer?.address ?? 'Chưa cập nhật';

        _nameController.text = _initialName;
        _phoneController.text = _initialPhone;
        _addressController.text = _initialAddress;
      });
    } catch (e) {
      // Xử lý lỗi nếu cần
      print('Failed to fetch user profile: $e');
    }
  }

  void _fetchAndSetBookingInfo() {
    final tourBookingProvider = context.read<TourBookingProvider>();
    final tourBooking = tourBookingProvider.getTourBookingInfo();

    if (tourBooking != null) {
      _startTimeController.text = tourBooking.startTime;
      _discountController.text = tourBooking.discount.toString();
      _totalAmountController.text = tourBooking.totalAmount.toString();
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();

    print('Token: ${authProvider.token}');

    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Container(
              color: AppColors.border,
              child: Column(
                children: [
                  _buildInfoCustomerSection(),
                  const SizedBox(height: 10),
                  _buildPaymentMethodSection(),
                  const SizedBox(height: 10),
                  _buildBookingInfoSection(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCustomerSection() {
    return Container(
      padding: const EdgeInsets.all(10),
      width: double.infinity,
      color: AppColors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your Details',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
          const SizedBox(height: 10),
          _buildReadOnlyTextField(_nameController, 'Name'),
          const SizedBox(height: 10),
          _buildReadOnlyTextField(_phoneController, 'Phone'),
          const SizedBox(height: 10),
          _buildReadOnlyTextField(_addressController, 'Address'),
        ],
      ),
    );
  }

  Widget _buildReadOnlyTextField(
      TextEditingController controller, String label) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      style: const TextStyle(fontSize: 14),
      readOnly: true,
    );
  }

  Widget _buildPaymentMethodSection() {
    return Container(
      padding: const EdgeInsets.all(10),
      width: double.infinity,
      color: AppColors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Payment Method',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: <Widget>[
              Radio<String>(
                value: 'cash',
                groupValue: 'cash',
                onChanged: (value) {},
              ),
              const Text('CASH', style: TextStyle(fontSize: 14)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBookingInfoSection() {
    final tourBookingProvider = context.watch<TourBookingProvider>();
    final tourBooking = tourBookingProvider.getTourBookingInfo();

    if (tourBooking == null) {
      return Container();
    }

    return Container(
      padding: const EdgeInsets.all(10),
      width: double.infinity,
      color: AppColors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Booking Information',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
          const SizedBox(height: 10),
          _buildStartTimeSection(tourBooking),
          const SizedBox(height: 10),
          _buildDiscountSection(tourBooking),
          const SizedBox(height: 10),
          _buildTotalAmountSection(tourBooking),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              try {
                if (_nameController.text == 'Chưa cập nhật' ||
                    _phoneController.text == 'Chưa cập nhật' ||
                    _addressController.text == 'Chưa cập nhật') {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text('Notification'),
                        content: const Text(
                            'You need to update your name, phone number, and address.'),
                        actions: <Widget>[
                          TextButton(
                            child: const Text('OK'),
                            onPressed: () {
                              Navigator.of(context).pop();
                              Navigator.of(context).pushNamed('/profile');
                            },
                          ),
                        ],
                      );
                    },
                  );
                } else {
                  final tourBookingProvider =
                      context.read<TourBookingProvider>();
                  final tourBooking = tourBookingProvider.getTourBookingInfo();

                  if (tourBooking == null) {
                    throw 'Tour booking information is not available';
                  }

                  final api = TourBookingApi();
                  final response = await api.createTourBooking(
                      context: context,
                      tourId: widget.tourId,
                      userId: context.read<AuthProvider>().userId,
                      startTime: _startTimeController.text,
                      adults: tourBooking.adults,
                      children: tourBooking.children,
                      baby: tourBooking.baby,
                      amount:
                          double.tryParse(_totalAmountController.text) ?? 0.0,
                      bookingStatus: 'SUCCESS',
                      paymentStatus: 'PENDING');

                  print('Tour Booking Response: $response');

                  // Navigator.of(context).pushNamed(
                  //   '/tour_checkout_success',
                  //   arguments: response,
                  // );

                  Navigator.of(context)
                      .pushNamed('/tour_checkout_success', arguments: {
                    'code': response['code'],
                    'amount': response['amount'],
                    'paymentStatus': response['paymentStatus'],
                  });
                }
              } catch (e) {
                print('Error: $e');
                // Show error message
                ScaffoldMessenger.of(context)
                    .showSnackBar(SnackBar(content: Text('Error: $e')));
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.greenDark,
              padding: const EdgeInsets.symmetric(vertical: 20.0),
              minimumSize: const Size(double.infinity, 40),
            ),
            child: const Text(
              'Checkout',
              style: TextStyle(
                  color: AppColors.white, fontWeight: FontWeight.bold),
            ),
          )
        ],
      ),
    );
  }
}

Widget _buildStartTimeSection(TourBooking tourBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Start Time',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        tourBooking.startTime,
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildDiscountSection(TourBooking tourBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Discount',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        formatCurrency(tourBooking.discount),
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildTotalAmountSection(TourBooking tourBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Total amount',
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppColors.grayText,
        ),
      ),
      Text(
        formatCurrency(tourBooking.totalAmount),
        style: const TextStyle(
            color: AppColors.greenDark,
            fontSize: 16,
            fontWeight: FontWeight.bold),
      ),
    ],
  );
}
