import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/room_booking_model.dart';
import 'package:flutter_application_1/src/services/room_booking_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/state/room_booking_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:flutter_application_1/src/services/user_api.dart';

class RoomCheckout extends StatefulWidget {
  const RoomCheckout({super.key, required this.roomId});

  final int roomId;

  @override
  State<RoomCheckout> createState() => _RoomCheckoutState();
}

class _RoomCheckoutState extends State<RoomCheckout> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _checkinController = TextEditingController();
  final _checkoutController = TextEditingController();
  final _roomTypeController = TextEditingController();
  final _roomNumberController = TextEditingController();
  final _discountController = TextEditingController();
  final _totalPriceController = TextEditingController();
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
    final roomBookingProvider = context.read<RoomBookingProvider>();
    final roomBooking = roomBookingProvider.getRoomBookingInfo();

    if (roomBooking != null) {
      _checkinController.text = roomBooking.startDate;
      _checkoutController.text = roomBooking.endDate;
      _roomTypeController.text = roomBooking.roomType;
      _roomNumberController.text = roomBooking.roomNumber;
      _discountController.text = roomBooking.discount.toString();
      _totalPriceController.text = roomBooking.price.toString();
      _totalAmountController.text = roomBooking.totalAmount.toString();
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
    final roomBookingProvider = context.watch<RoomBookingProvider>();
    final roomBooking = roomBookingProvider.getRoomBookingInfo();

    if (roomBooking == null) {
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
          _buildCheckinSection(roomBooking),
          const SizedBox(height: 10),
          _buildCheckoutSection(roomBooking),
          const SizedBox(height: 10),
          _buildRoomTypeSection(roomBooking),
          const SizedBox(height: 10),
          _buildRoomNumberSection(roomBooking),
          const SizedBox(height: 10),
          _buildDiscountSection(roomBooking),
          const SizedBox(height: 10),
          _buildPriceSection(roomBooking),
          const SizedBox(height: 20),
          _buildTotalAmountSection(roomBooking),
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
                  final roomBookingProvider =
                      context.read<RoomBookingProvider>();
                  final roomBooking = roomBookingProvider.getRoomBookingInfo();

                  if (roomBooking == null) {
                    throw 'Tour booking information is not available';
                  }

                  final api = RoomBookingApi();
                  final response = await api.createRoomBooking(
                      context: context,
                      userId: context.read<AuthProvider>().userId,
                      roomId: widget.roomId,
                      startDate: _checkinController.text,
                      endDate: _checkoutController.text,
                      roomType: _roomTypeController.text,
                      roomNumber: _roomNumberController.text,
                      price:
                          double.tryParse(_totalAmountController.text) ?? 0.0,
                      hotelName: roomBooking.hotelName);

                  print('Room Booking Response: $response');

                  Navigator.of(context)
                      .pushNamed('/room_checkout_success', arguments: {
                    'roomInfo':
                        '${roomBooking.roomType} - ${roomBooking.roomNumber}',
                    'totalAmount': roomBooking.totalAmount,
                    'paymentStatus': "PENDING",
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

Widget _buildCheckinSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Checkin',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        roomBooking.startDate,
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildCheckoutSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Checkout',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        roomBooking.endDate,
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildRoomTypeSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Room Type',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        roomBooking.roomType,
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildRoomNumberSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Room Number',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        roomBooking.roomNumber,
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildDiscountSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Discount',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        formatCurrency(roomBooking.discount),
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildPriceSection(RoomBooking roomBooking) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      const Text(
        'Total Price',
        style: TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
      Text(
        formatCurrency(roomBooking.price),
        style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
      ),
    ],
  );
}

Widget _buildTotalAmountSection(RoomBooking roomBooking) {
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
        formatCurrency(roomBooking.totalAmount),
        style: const TextStyle(
            color: AppColors.greenDark,
            fontSize: 16,
            fontWeight: FontWeight.bold),
      ),
    ],
  );
}
