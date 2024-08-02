import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/services/tour_booking_api.dart';
import 'package:flutter_application_1/src/models/tour_booking_customer_model.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';

class TourBookings extends StatefulWidget {
  const TourBookings({super.key});

  @override
  State<TourBookings> createState() => _TourBookingsState();
}

class _TourBookingsState extends State<TourBookings> {
  int _selectedIndex = 1;
  bool _hasMoreTourBookings = true;
  int _currentPage = 1;
  final int _pageSize = 5;
  final List<TourBookingCustomer> _tourBookings = [];
  late Future<void> _tourBookingsFuture;
  final TourBookingApi _tourBookingApi = TourBookingApi();

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

  @override
  void initState() {
    super.initState();
    _tourBookingsFuture = fetchTourBookingsByUserId();
  }

  Future<void> fetchTourBookingsByUserId() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;
    try {
      List<TourBookingCustomer> tourBookings =
          await _tourBookingApi.fetchTourBookingsByUserId(
        context: context,
        userId: userId,
        page: _currentPage,
        limit: _pageSize,
      );
      setState(() {
        if (tourBookings.isEmpty) {
          _hasMoreTourBookings = false;
        } else {
          _tourBookings.addAll(tourBookings);
          _currentPage++;
        }
      });
    } catch (e) {
      print('Error fetching tour bookings: $e');
      setState(() {
        _hasMoreTourBookings = false;
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
              _buildTourBookingsListSection(),
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
            'Tour Bookings List',
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

  Widget _buildTourBookingsListSection() {
    if (_tourBookings.isEmpty) {
      return Center(
        child: Text(
          'No tour bookings found',
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
          itemCount: _tourBookings.length + (_hasMoreTourBookings ? 1 : 0),
          itemBuilder: (BuildContext context, int index) {
            if (index == _tourBookings.length) {
              return _hasMoreTourBookings
                  ? _buildLoadMoreButton()
                  : SizedBox.shrink();
            }
            TourBookingCustomer tourBooking = _tourBookings[index];
            return GestureDetector(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  '/tour_detail',
                  arguments: tourBooking.tourId,
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
                    ClipRRect(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(20.0),
                        bottomLeft: Radius.circular(20.0),
                      ),
                      child: Image.network(
                        tourBooking.thumbnail ?? '',
                        width: 140,
                        height: 140,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            // RatingBarIndicator(
                            //   rating: 0,
                            //   itemBuilder: (context, index) => const Icon(
                            //     Icons.star,
                            //     color: Colors.amber,
                            //   ),
                            //   itemCount: 5,
                            //   itemSize: 16,
                            //   direction: Axis.horizontal,
                            // ),
                            // const SizedBox(height: 5),
                            Text(
                              tourBooking.tourName,
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
                              formatCurrency(tourBooking.amount),
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppColors.greenDark,
                              ),
                            ),

                            const SizedBox(height: 5),
                            Text(
                              "Booking code: ${tourBooking.code}",
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.grayDark,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              "Payment status: ${tourBooking.paymentStatus}",
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.grayDark,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              "Start time: ${tourBooking.startTime}",
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.grayDark,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Row(
                              children: [
                                if (tourBooking.adults > 0)
                                  Text(
                                    "Adults: ${tourBooking.adults}",
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.grayDark,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                SizedBox(
                                  width: 10,
                                ),
                                if (tourBooking.children > 0)
                                  Text(
                                    "Children: ${tourBooking.children}",
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.grayDark,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                SizedBox(
                                  width: 10,
                                ),
                                if (tourBooking.baby > 0)
                                  Text(
                                    "Babies: ${tourBooking.baby}",
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      color: AppColors.grayDark,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                              ],
                            )
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
          if (_hasMoreTourBookings) {
            fetchTourBookingsByUserId();
          }
        },
      ),
    );
  }
}
