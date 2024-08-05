import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/room_booking_customer_model.dart';
import 'package:flutter_application_1/src/services/room_booking_api.dart';
import 'package:flutter_application_1/src/services/tour_booking_api.dart';
import 'package:flutter_application_1/src/models/tour_booking_customer_model.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';

class RoomBookings extends StatefulWidget {
  const RoomBookings({super.key});

  @override
  State<RoomBookings> createState() => _RoomBookingsState();
}

class _RoomBookingsState extends State<RoomBookings> {
  int _selectedIndex = 1;
  bool _hasMoreRoomBookings = true;
  int _currentPage = 1;
  final int _pageSize = 5;
  final List<RoomBookingCustomer> _roomBookings = [];
  late Future<void> _roomBookingsFuture;
  final RoomBookingApi _roomBookingApi = RoomBookingApi();

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
        Navigator.pushNamed(context, '/blogs_list');
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
  void initState() {
    super.initState();
    _roomBookingsFuture = fetchRoomBookingsByUserId();
  }

  Future<void> fetchRoomBookingsByUserId() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;
    try {
      List<RoomBookingCustomer> roomBookings =
          await _roomBookingApi.fetchRoomBookingsByUserId(
        context: context,
        userId: userId,
        page: _currentPage,
        limit: _pageSize,
      );
      setState(() {
        if (roomBookings.isEmpty) {
          _hasMoreRoomBookings = false;
        } else {
          _roomBookings.addAll(roomBookings);
          _currentPage++;
        }
      });
    } catch (e) {
      print('Error fetching room bookings: $e');
      setState(() {
        _hasMoreRoomBookings = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          color: AppColors.white,
          child: Column(
            children: [
              _buildTitleSection(),
              _buildRoomBookingsListSection(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildTitleSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: BorderSide(
            color: AppColors.border,
            width: 1.0,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Room Bookings List',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoomBookingsListSection() {
    if (_roomBookings.isEmpty) {
      return Center(
        child: Text(
          'No room bookings found',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: AppColors.grayText,
          ),
        ),
      );
    }

    return SizedBox(
        height: MediaQuery.of(context).size.height,
        child: ListView.builder(
          padding: const EdgeInsets.all(10),
          itemCount: _roomBookings.length + (_hasMoreRoomBookings ? 1 : 0),
          itemBuilder: (BuildContext context, int index) {
            if (index == _roomBookings.length) {
              return _hasMoreRoomBookings
                  ? _buildLoadMoreButton()
                  : SizedBox.shrink();
            }
            RoomBookingCustomer roomBooking = _roomBookings[index];
            return GestureDetector(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  '/hotels_list',
                );
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppColors.border,
                    width: 1.0,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      spreadRadius: 1,
                      blurRadius: 5,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              roomBooking.roomNumber,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.grayText,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              formatCurrency(roomBooking.price),
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppColors.greenDark,
                              ),
                            ),
                            // const SizedBox(height: 5),
                            // Text(
                            //   "Booking code: ${tourBooking.code}",
                            //   maxLines: 1,
                            //   overflow: TextOverflow.ellipsis,
                            //   style: const TextStyle(
                            //     fontSize: 10,
                            //     color: AppColors.grayDark,
                            //     fontWeight: FontWeight.w500,
                            //   ),
                            // ),
                            // const SizedBox(height: 5),
                            // Text(
                            //   "Payment status: ${tourBooking.paymentStatus}",
                            //   maxLines: 1,
                            //   overflow: TextOverflow.ellipsis,
                            //   style: const TextStyle(
                            //     fontSize: 10,
                            //     color: AppColors.grayDark,
                            //     fontWeight: FontWeight.w500,
                            //   ),
                            // ),
                            // const SizedBox(height: 5),
                            // Text(
                            //   "Start time: ${tourBooking.startTime}",
                            //   maxLines: 1,
                            //   overflow: TextOverflow.ellipsis,
                            //   style: const TextStyle(
                            //     fontSize: 10,
                            //     color: AppColors.grayDark,
                            //     fontWeight: FontWeight.w500,
                            //   ),
                            // ),
                            // const SizedBox(height: 5),
                            // Row(
                            //   children: [
                            //     if (tourBooking.adults > 0)
                            //       Text(
                            //         "Adults: ${tourBooking.adults}",
                            //         maxLines: 1,
                            //         overflow: TextOverflow.ellipsis,
                            //         style: const TextStyle(
                            //           fontSize: 10,
                            //           color: AppColors.grayDark,
                            //           fontWeight: FontWeight.w500,
                            //         ),
                            //       ),
                            //     SizedBox(
                            //       width: 10,
                            //     ),
                            //     if (tourBooking.children > 0)
                            //       Text(
                            //         "Children: ${tourBooking.children}",
                            //         maxLines: 1,
                            //         overflow: TextOverflow.ellipsis,
                            //         style: const TextStyle(
                            //           fontSize: 10,
                            //           color: AppColors.grayDark,
                            //           fontWeight: FontWeight.w500,
                            //         ),
                            //       ),
                            //     SizedBox(
                            //       width: 10,
                            //     ),
                            //     if (tourBooking.baby > 0)
                            //       Text(
                            //         "Babies: ${tourBooking.baby}",
                            //         maxLines: 1,
                            //         overflow: TextOverflow.ellipsis,
                            //         style: const TextStyle(
                            //           fontSize: 10,
                            //           color: AppColors.grayDark,
                            //           fontWeight: FontWeight.w500,
                            //         ),
                            //       ),
                            //   ],
                            // )
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ));
  }

  Widget _buildLoadMoreButton() {
    return Center(
      child: CustomButton(
        backgroundColor: AppColors.greenDark,
        textColor: AppColors.white,
        text: 'See more',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        onPressed: () {
          if (_hasMoreRoomBookings) {
            fetchRoomBookingsByUserId();
          }
        },
      ),
    );
  }
}
