import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/hotel_model.dart';
import 'package:flutter_application_1/src/models/room_booking_model.dart';
import 'package:flutter_application_1/src/services/hotel_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/state/room_booking_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';

class HotelDetail extends StatefulWidget {
  final int hotelId;

  const HotelDetail({super.key, required this.hotelId});

  @override
  State<HotelDetail> createState() => _HotelDetailState();
}

class _HotelDetailState extends State<HotelDetail> {
  late Future<Hotel> _hotelFuture;
  late Hotel _hotel;
  Room? _selectedRoom;
  // late Future<List<TourReview>> _reviewsFuture;
  // late Future<UserModel> _userModelFuture;
  // final TourReviewApi _reviewApi = TourReviewApi();
  bool _showFullDetail = false;
  // bool _canLeaveReview = false;
  int _selectedIndex = 0;
  late String _selectedImageUrl;
  DateTime? _checkInDate;
  DateTime? _checkOutDate;

  // UserModel? _userModel;

  int get quantityDay {
    if (_checkInDate != null && _checkOutDate != null) {
      return _checkOutDate!.difference(_checkInDate!).inDays;
    }
    return 0;
  }

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

  String _truncateHtml(String html, {int maxLength = 200}) {
    if (html.length > maxLength) {
      return '${html.substring(0, maxLength)}...';
    } else {
      return html;
    }
  }

  // Các biến cần thiết cho booking
  // int quantityAdults = 1;
  // int quantityChildren = 0;
  // int quantityBaby = 0;
  // List<String>? dataStartTimes;
  String? errorStartDate;
  String? errorEndDate;
  // String? selectedStartTime;

  // late TextEditingController _adultController;
  // late TextEditingController _childController;
  // late TextEditingController _babyController;

  @override
  void initState() {
    super.initState();
    // _userModelFuture = _fetchUserProfile();
    _hotelFuture = _fetchHotel();
    // _reviewsFuture = _reviewApi.fetchTourReviews(tourId: widget.tourId);
    // _adultController = TextEditingController(text: quantityAdults.toString());
    // _childController = TextEditingController(text: quantityChildren.toString());
    // _babyController = TextEditingController(text: quantityBaby.toString());
  }

  Future<Hotel> _fetchHotel() async {
    final hotelApi = HotelApi();
    final hotel = await hotelApi.getHotelById(hotelId: widget.hotelId);
    setState(() {
      _hotel = hotel;
      if (_hotel.rooms.isNotEmpty) {
        _selectedRoom = _hotel.rooms.first;
      }
    });
    return hotel;
  }

  void _onThumbnailClick(String imageUrl) {
    print(imageUrl);
    setState(() {
      _selectedImageUrl = imageUrl;
    });
  }

  // @override
  // void dispose() {
  //   _adultController.dispose();
  //   _childController.dispose();
  //   _babyController.dispose();
  //   super.dispose();
  // }

  // Future<UserModel> _fetchUserProfile() async {
  //   final authProvider = Provider.of<AuthProvider>(context, listen: false);
  //   final userId = authProvider.userId;
  //   final userApi = UserApi();
  //   final userModel = await userApi.getProfileByUserId(context, userId);
  //   _checkReviewStatus(userModel.tourBookings ?? []);
  //   setState(() {
  //     _userModel = userModel;
  //   });
  //   return userModel;
  // }

  // void _checkReviewStatus(List<TourBookingModel> bookings) {
  //   print('Checking Review Status for Bookings:');
  //   bookings.forEach((booking) {
  //     print(
  //         'Booking ID: ${booking.id}, Tour ID: ${booking.tourId}, Review Status: ${booking.reviewStatus}, Booking Status: ${booking.bookingStatus}');
  //   });

  //   final hasActiveBooking = bookings.any((booking) =>
  //       booking.tourId == widget.tourId &&
  //       booking.reviewStatus == 'NOT_PROVIDED');

  //   // Debugging: Print if there's an active booking
  //   print('Has Active Booking for Review: $hasActiveBooking');

  //   setState(() {
  //     _canLeaveReview = hasActiveBooking;
  //   });
  // }

  // void _showReviewDialog(UserModel userModel, Tour tour) {
  //   final TextEditingController _nameController =
  //       TextEditingController(text: userModel.customer?.name);
  //   final TextEditingController _emailController =
  //       TextEditingController(text: userModel.email);
  //   final TextEditingController _contentController = TextEditingController();
  //   double _rating = 0.0;
  //   TourBookingModel? _selectedTourBooking;

  //   // Extract tour bookings from userModel
  //   final List<TourBookingModel>? tourBookings = userModel.tourBookings;

  //   // If tourBookings is null, default to an empty list
  //   final List<TourBookingModel> nonNullableTourBookings = tourBookings ?? [];

  //   // Extract start times from tour bookings
  //   final List<String> startTimes = nonNullableTourBookings
  //       .map((booking) => booking.startTime)
  //       .toSet() // Ensure unique start times
  //       .toList();

  //   // Create a mapping from start times to TourBookingModel IDs
  //   final Map<String, TourBookingModel> startTimeToBooking = {
  //     for (var booking in nonNullableTourBookings) booking.startTime: booking
  //   };

  //   // Get the tour's start times
  //   final List<TourTime> tourTimes = tour.tourTimes;

  //   // Extract start times from tourTimes (assuming you want to use startDate for comparison)
  //   final List<String> tourStartTimes = tourTimes
  //       .map((time) => time.startDate)
  //       .toSet() // Ensure unique start times
  //       .toList();

  //   // Filter start times to only include those that match the tour's start times
  //   final List<String> filteredStartTimes = startTimes
  //       .where((startTime) => tourStartTimes.contains(startTime))
  //       .toList();

  //   showDialog(
  //     context: context,
  //     builder: (BuildContext context) {
  //       final double dialogWidth = MediaQuery.of(context).size.width - 20;

  //       return Dialog(
  //         child: Container(
  //           width: dialogWidth,
  //           padding: const EdgeInsets.all(16.0),
  //           child: Column(
  //             mainAxisSize: MainAxisSize.min,
  //             children: [
  //               const Text('Write a Review',
  //                   style:
  //                       TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
  //               const SizedBox(height: 16),
  //               TextField(
  //                 controller: _nameController,
  //                 decoration: const InputDecoration(
  //                   labelText: 'Name',
  //                 ),
  //                 enabled: false,
  //               ),
  //               TextField(
  //                 controller: _emailController,
  //                 decoration: const InputDecoration(labelText: 'Email'),
  //                 enabled: false,
  //               ),
  //               TextField(
  //                 controller: _contentController,
  //                 decoration: const InputDecoration(labelText: 'Content'),
  //                 maxLines: 3,
  //               ),
  //               const SizedBox(height: 10),
  //               RatingBar.builder(
  //                 initialRating: 0,
  //                 minRating: 1,
  //                 direction: Axis.horizontal,
  //                 allowHalfRating: true,
  //                 itemCount: 5,
  //                 itemSize: 20,
  //                 itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
  //                 itemBuilder: (context, _) => const Icon(
  //                   Icons.star,
  //                   color: Colors.amber,
  //                 ),
  //                 onRatingUpdate: (rating) {
  //                   _rating = rating;
  //                 },
  //               ),
  //               const SizedBox(height: 10),
  //               DropdownButton<String>(
  //                 value: _selectedTourBooking?.startTime,
  //                 hint: const Text('Select Start Time'),
  //                 items: filteredStartTimes.map((String startTime) {
  //                   return DropdownMenuItem<String>(
  //                     value: startTime,
  //                     child: Text(startTime),
  //                   );
  //                 }).toList(),
  //                 onChanged: (String? newValue) {
  //                   setState(() {
  //                     _selectedTourBooking = startTimeToBooking[newValue!];
  //                   });
  //                 },
  //               ),
  //               const SizedBox(height: 20),
  //               Row(
  //                 mainAxisAlignment: MainAxisAlignment.end,
  //                 children: [
  //                   TextButton(
  //                     child: const Text('Cancel'),
  //                     onPressed: () {
  //                       Navigator.of(context).pop();
  //                     },
  //                   ),
  //                   TextButton(
  //                     child: const Text('Submit'),
  //                     onPressed: () {
  //                       if (_nameController.text.isEmpty ||
  //                           _emailController.text.isEmpty ||
  //                           _contentController.text.isEmpty ||
  //                           _rating <= 0 ||
  //                           _selectedTourBooking == null) {
  //                         ScaffoldMessenger.of(context).showSnackBar(
  //                           const SnackBar(
  //                             content: Text(
  //                                 'Please fill all fields, provide a rating, and select a start time.'),
  //                             backgroundColor: Colors.red,
  //                           ),
  //                         );
  //                         return;
  //                       }

  //                       final review = TourReview(
  //                         userId: _userModel!.id,
  //                         tourId: tour.id.toInt(),
  //                         customerName: _nameController.text,
  //                         tourBookingId: _selectedTourBooking!.id,
  //                         content: _contentController.text,
  //                         rating: _rating,
  //                       );

  //                       _submitReview(review);

  //                       Navigator.of(context).pop();
  //                     },
  //                   ),
  //                 ],
  //               ),
  //             ],
  //           ),
  //         ),
  //       );
  //     },
  //   );
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: FutureBuilder<Hotel>(
        future: _hotelFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('No tour data available'));
          } else {
            final hotel = snapshot.data!;

            _selectedImageUrl = hotel.thumbnailUrls.first;

            return SingleChildScrollView(
                child: Container(
              color: AppColors.border,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoSection(hotel),
                  const SizedBox(height: 10),
                  _buildDescriptionSection(hotel),
                  const SizedBox(height: 10),
                  _buildBookingSection(hotel),
                  const SizedBox(height: 10),
                  _buildContactSection()
                  // _buildReviewsSection(tour),
                  // const SizedBox(height: 10),
                  // _buildContactSection(tour),
                ],
              ),
            ));
          }
        },
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildInfoSection(Hotel hotel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          color: AppColors.white,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 200,
                child: ClipRRect(
                  child: Image.network(
                    _selectedImageUrl,
                    fit: BoxFit.cover,
                    width: double.infinity,
                  ),
                ),
              ),
              Container(
                padding: EdgeInsets.all(10),
                child: SizedBox(
                  height: 80,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: hotel.thumbnailUrls.length,
                    itemBuilder: (context, index) {
                      final thumbnailUrl = hotel.thumbnailUrls[index];
                      return GestureDetector(
                        onTap: () => _onThumbnailClick(thumbnailUrl),
                        child: Container(
                          margin: const EdgeInsets.only(right: 10),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              thumbnailUrl,
                              width: 100,
                              height: 80,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(10),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        hotel.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 5),
                      RatingBarIndicator(
                        rating: hotel.rating,
                        itemBuilder: (context, index) => const Icon(
                          Icons.star,
                          color: Colors.amber,
                        ),
                        itemCount: 5,
                        itemSize: 20.0,
                        direction: Axis.horizontal,
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Text(
                        "Address: ${hotel.address}",
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ]),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDescriptionSection(Hotel hotel) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          color: AppColors.white,
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Description",
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.grayDark,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Html(
                  data: _showFullDetail
                      ? hotel.description
                      : _truncateHtml(hotel.description),
                  style: {
                    "body": Style(
                      fontSize: FontSize(14.0),
                      color: AppColors.grayText,
                    ),
                    "h1": Style(
                      fontSize: FontSize(22.0),
                      fontWeight: FontWeight.bold,
                    ),
                    "h3": Style(
                      fontSize: FontSize(18.0),
                      fontWeight: FontWeight.bold,
                    ),
                    "p": Style(
                      fontSize: FontSize(14.0),
                    ),
                    "ul": Style(
                      fontSize: FontSize(14.0),
                    ),
                    "li": Style(
                      fontSize: FontSize(14.0),
                    ),
                  },
                ),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () {
                  setState(() {
                    _showFullDetail = !_showFullDetail;
                  });
                },
                child: Text(
                  _showFullDetail ? 'Hide' : 'Show More',
                  style: const TextStyle(
                    color: AppColors.greenDark,
                    fontSize: 14,
                  ),
                ),
              )
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBookingSection(Hotel hotel) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          color: AppColors.white,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "Booking",
                      style: TextStyle(
                        fontSize: 14,
                        color: AppColors.grayDark,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    _buildRoomTypeSection(hotel),
                    const SizedBox(height: 20),
                    _buildDatePicker(),
                    const SizedBox(height: 10),
                    _buildDiscountSection(),
                    const SizedBox(height: 10),
                    _buildQuantityDaySection(),
                    const SizedBox(height: 10),
                    _buildTotalPriceSection(),
                    const SizedBox(height: 10),
                    _buildTotalAmountSection(),
                    const SizedBox(height: 20),
                    _buildButtons(hotel),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRoomTypeSection(Hotel hotel) {
    return DropdownButton<Room>(
      value: _selectedRoom,
      hint: const Text('Select Room Type'),
      onChanged: (Room? newValue) {
        setState(() {
          _selectedRoom = newValue;
        });

        print("_selectedRoom: $_selectedRoom");
      },
      items: hotel.rooms.map((Room room) {
        return DropdownMenuItem<Room>(
          value: room,
          child: Text("${room.type} - Number ${room.roomNumber}"),
        );
      }).toList(),
    );
  }

  Widget _buildDatePicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildDateButton(
          label: 'Check-in Date',
          selectedDate: _checkInDate,
          onDateSelected: (date) {
            setState(() {
              _checkInDate = date;
              if (_checkOutDate != null && _checkOutDate!.isBefore(date)) {
                _checkOutDate =
                    null; // Reset check-out date if it's before check-in date
              }
            });
          },
        ),
        const SizedBox(height: 10),
        _buildDateButton(
          label: 'Check-out Date',
          selectedDate: _checkOutDate,
          onDateSelected: (date) {
            setState(() {
              _checkOutDate = date;
              if (_checkInDate != null && date.isBefore(_checkInDate!)) {
                _checkInDate =
                    null; // Reset check-in date if it's after check-out date
              }
            });
          },
        ),
      ],
    );
  }

  Widget _buildDateButton({
    required String label,
    required DateTime? selectedDate,
    required Function(DateTime) onDateSelected,
  }) {
    return GestureDetector(
      onTap: () async {
        DateTime? date = await showDatePicker(
          context: context,
          initialDate: selectedDate ?? DateTime.now(),
          firstDate: DateTime.now(),
          lastDate: DateTime(2100),
        );
        if (date != null) {
          onDateSelected(date);
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              selectedDate != null
                  ? '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}'
                  : 'Select Date',
              style: TextStyle(fontSize: 16),
            ),
            Icon(Icons.calendar_today),
          ],
        ),
      ),
    );
  }

  Widget _buildDiscountSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Discount',
          style: TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
        Text(
          formatCurrency(_selectedRoom!.discount),
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildQuantityDaySection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Days',
          style: TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
        Text(
          "$quantityDay",
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildTotalPriceSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Total Price',
          style: TextStyle(
              color: AppColors.grayMid,
              fontSize: 14,
              fontWeight: FontWeight.bold),
        ),
        Text(
          formatCurrency(_selectedRoom!.weekdayPrice),
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildTotalAmountSection() {
    final room = _selectedRoom;
    final days = quantityDay;
    final discount = room?.discount ?? 0.0;
    final pricePerDay = room?.weekdayPrice ?? 0.0;

    final totalAmount = days * (pricePerDay - discount);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Total amount',
          style: TextStyle(
              color: Colors.grey, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        Text(
          formatCurrency(totalAmount),
          style: const TextStyle(
              color: AppColors.greenDark,
              fontSize: 16,
              fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  Widget _buildButtons(Hotel hotel) {
    return Row(
      children: [
        Expanded(
          child: CustomButton(
            backgroundColor: AppColors.greenDark,
            textColor: AppColors.white,
            text: 'Book now',
            hoverColor: Colors.lightBlue,
            borderRadius: 20,
            fontSize: 14,
            fontWeight: FontWeight.w600,
            onPressed: () => handleNavigateCheckout(context, hotel),
            paddingTop: 20,
            paddingBottom: 20,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: CustomButton(
            backgroundColor: AppColors.white,
            textColor: AppColors.greenDark,
            text: 'Add to wishlist',
            hoverColor: Colors.lightBlue,
            borderRadius: 20,
            fontSize: 14,
            fontWeight: FontWeight.w600,
            // onPressed: () => handleAddWishlist(tour.id),
            paddingTop: 20,
            paddingBottom: 20,
            borderWidth: 1,
            borderColor: AppColors.greenDark,
          ),
        ),
      ],
    );
  }

  void handleNavigateCheckout(BuildContext context, Hotel hotel) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    // Debug information
    print('AuthProvider.isAuthenticated: ${authProvider.isAuthenticated}');
    print('AuthProvider.token: ${authProvider.token}');
    print('AuthProvider.username: ${authProvider.username}');
    print('AuthProvider.userId: ${authProvider.userId}');

    if (!authProvider.isAuthenticated) {
      Navigator.pushNamed(context, '/login');
      return;
    }

    if (_checkInDate == null) {
      setState(() {
        errorStartDate = "Please choose start date";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please choose start date'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_checkOutDate == null) {
      setState(() {
        errorEndDate = "Please choose end date";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please choose end date'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_checkOutDate!.isBefore(_checkInDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Check-out date cannot be before check-in date'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final roomBooking = RoomBooking(
      roomId: _selectedRoom!.id,
      roomType: _selectedRoom!.type,
      roomNumber: _selectedRoom!.roomNumber,
      startDate:
          '${_checkInDate!.year}-${_checkInDate!.month.toString().padLeft(2, '0')}-${_checkInDate!.day.toString().padLeft(2, '0')}',
      endDate:
          '${_checkOutDate!.year}-${_checkOutDate!.month.toString().padLeft(2, '0')}-${_checkOutDate!.day.toString().padLeft(2, '0')}',
      discount: _selectedRoom!.discount,
      price: _selectedRoom!.weekdayPrice,
      totalAmount:
          quantityDay * (_selectedRoom!.weekdayPrice - _selectedRoom!.discount),
      hotelName: hotel.name,
    );

    // Debug booking information
    print('Booking Information:');
    print('Room ID: ${_selectedRoom!.id}');
    print('Room Type: ${_selectedRoom!.type}');
    print('Room Number: ${_selectedRoom!.roomNumber}');
    print('Start Date: ${_checkInDate}');
    print('End Date: ${_checkOutDate}');
    print('Discount: ${_selectedRoom!.discount}');
    print('Price per Day: ${_selectedRoom!.weekdayPrice}');
    print(
        'Total Amount: ${quantityDay * (_selectedRoom!.weekdayPrice - _selectedRoom!.discount)}');
    print('Hotel Name: ${hotel.name}');

    // Save booking to provider
    final roomBookingProvider =
        Provider.of<RoomBookingProvider>(context, listen: false);
    roomBookingProvider.setRoomBooking(roomBooking);

    // Navigate to checkout page
    Navigator.pushNamed(context, '/room_checkout',
        arguments: _selectedRoom!.id);
  }

  // void handleAddWishlist(int tourId) {
  //   // Add to wishlist logic
  // }

  // Widget _buildReviewsSection(Tour tour) {
  //   return FutureBuilder<List<TourReview>>(
  //     future: _reviewsFuture,
  //     builder: (context, snapshot) {
  //       if (snapshot.connectionState == ConnectionState.waiting) {
  //         return const Center(child: CircularProgressIndicator());
  //       } else if (snapshot.hasError) {
  //         return Container(
  //           width: double.infinity,
  //           color: AppColors.white,
  //           child: Padding(
  //             padding: const EdgeInsets.all(10.0),
  //             child: Column(
  //               crossAxisAlignment: CrossAxisAlignment.start,
  //               children: [
  //                 const Text(
  //                   "Reviews",
  //                   style: TextStyle(
  //                     fontSize: 16,
  //                     fontWeight: FontWeight.bold,
  //                   ),
  //                 ),
  //                 const SizedBox(height: 10),
  //                 if (_canLeaveReview)
  //                   CustomButton(
  //                     backgroundColor: AppColors.greenDark,
  //                     textColor: AppColors.white,
  //                     text: 'Leave a Review',
  //                     hoverColor: Colors.lightBlue,
  //                     borderRadius: 20,
  //                     fontSize: 12,
  //                     fontWeight: FontWeight.w600,
  //                     onPressed: () => _userModel != null
  //                         ? _showReviewDialog(_userModel!, tour)
  //                         : null,
  //                   ),
  //                 const SizedBox(height: 10),
  //                 Center(
  //                   child: Text(
  //                     'No reviews found',
  //                     style: TextStyle(fontSize: 16, color: Colors.grey),
  //                   ),
  //                 ),
  //               ],
  //             ),
  //           ),
  //         );
  //       } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
  //         return Container(
  //           width: double.infinity,
  //           color: AppColors.white,
  //           child: Padding(
  //             padding: const EdgeInsets.all(10.0),
  //             child: Column(
  //               crossAxisAlignment: CrossAxisAlignment.start,
  //               children: [
  //                 const Text(
  //                   "Reviews",
  //                   style: TextStyle(
  //                     fontSize: 16,
  //                     fontWeight: FontWeight.bold,
  //                   ),
  //                 ),
  //                 const SizedBox(height: 10),
  //                 if (_canLeaveReview)
  //                   CustomButton(
  //                     backgroundColor: AppColors.greenDark,
  //                     textColor: AppColors.white,
  //                     text: 'Leave a Review',
  //                     hoverColor: Colors.lightBlue,
  //                     borderRadius: 20,
  //                     fontSize: 12,
  //                     fontWeight: FontWeight.w600,
  //                     onPressed: () => _userModel != null
  //                         ? _showReviewDialog(_userModel!, tour)
  //                         : null,
  //                   ),
  //                 const SizedBox(height: 10),
  //                 Center(
  //                   child: Text(
  //                     'No reviews found',
  //                     style: TextStyle(fontSize: 16, color: Colors.grey),
  //                   ),
  //                 ),
  //               ],
  //             ),
  //           ),
  //         );
  //       } else {
  //         final reviews = snapshot.data!;

  //         reviews.sort((a, b) {
  //           final dateA = a.createdAt ?? DateTime(1900);
  //           final dateB = b.createdAt ?? DateTime(1900);
  //           return dateB.compareTo(dateA);
  //         });

  //         return Container(
  //           width: double.infinity,
  //           color: AppColors.white,
  //           child: Padding(
  //             padding: const EdgeInsets.all(10.0),
  //             child: Column(
  //               crossAxisAlignment: CrossAxisAlignment.start,
  //               children: [
  //                 Row(
  //                   children: [
  //                     const Text(
  //                       "Reviews",
  //                       style: TextStyle(
  //                         fontSize: 16,
  //                         fontWeight: FontWeight.bold,
  //                       ),
  //                     ),
  //                     const SizedBox(width: 5),
  //                     Text(
  //                       "(${tour.rating.toStringAsFixed(1)})",
  //                       style: const TextStyle(
  //                         fontSize: 14,
  //                         fontWeight: FontWeight.w500,
  //                         color: AppColors.orange,
  //                       ),
  //                     ),
  //                   ],
  //                 ),
  //                 const SizedBox(height: 10),
  //                 if (_canLeaveReview)
  //                   CustomButton(
  //                     backgroundColor: AppColors.greenDark,
  //                     textColor: AppColors.white,
  //                     text: 'Leave a Review',
  //                     hoverColor: Colors.lightBlue,
  //                     borderRadius: 20,
  //                     fontSize: 12,
  //                     fontWeight: FontWeight.w600,
  //                     onPressed: () => _userModel != null
  //                         ? _showReviewDialog(_userModel!, tour)
  //                         : null,
  //                   ),
  //                 const SizedBox(height: 10),
  //                 ListView.builder(
  //                   shrinkWrap: true,
  //                   physics: const NeverScrollableScrollPhysics(),
  //                   itemCount: reviews.length,
  //                   itemBuilder: (context, index) {
  //                     final review = reviews[index];
  //                     return ListTile(
  //                       contentPadding:
  //                           const EdgeInsets.symmetric(vertical: 8.0),
  //                       title: Text(review.customerName),
  //                       subtitle: Column(
  //                         crossAxisAlignment: CrossAxisAlignment.start,
  //                         children: [
  //                           RatingBarIndicator(
  //                             rating: review.rating,
  //                             itemBuilder: (context, index) => const Icon(
  //                               Icons.star,
  //                               color: Colors.amber,
  //                             ),
  //                             itemCount: 5,
  //                             itemSize: 16.0,
  //                             direction: Axis.horizontal,
  //                           ),
  //                           const SizedBox(height: 4),
  //                           Text(
  //                             review.content,
  //                             style: const TextStyle(fontSize: 14),
  //                           ),
  //                           const SizedBox(height: 4),
  //                           Text(
  //                             // 'Posted on: ${formatDate(review.createdAt)}',
  //                             'Posted on: ${formatDate(review.createdAt ?? DateTime.now())}',
  //                             style: const TextStyle(
  //                                 fontSize: 12, color: Colors.grey),
  //                           ),
  //                         ],
  //                       ),
  //                     );
  //                   },
  //                 ),
  //               ],
  //             ),
  //           ),
  //         );
  //       }
  //     },
  //   );
  // }

  // void _submitReview(TourReview review) async {
  //   try {
  //     print("Submitting review: ${review.toString()}");

  //     // Call the createTourReview function and await its result
  //     final message = await _reviewApi.createTourReview(
  //       context: context,
  //       tourReview: review,
  //     );

  //     // Refresh the reviews list after submission
  //     setState(() {
  //       _canLeaveReview = false;
  //       _tourFuture = _tourApi.getTourById(tourId: widget.tourId);
  //       _reviewsFuture = _reviewApi.fetchTourReviews(tourId: widget.tourId);
  //     });

  //     // Show success message using Snackbar
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(
  //         content: Text(message), // Display the message from API response
  //         backgroundColor: Colors.green,
  //       ),
  //     );
  //   } catch (e) {
  //     print('Error submitting review: $e');

  //     // Show error message using Snackbar
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(
  //         content:
  //             Text('Error submitting review: $e'), // Display the error message
  //         backgroundColor: Colors.red,
  //       ),
  //     );
  //   }
  // }

  Widget _buildContactSection() {
    return Column(
      children: [
        Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            color: AppColors.white,
          ),
          child: Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              children: [
                const Icon(
                  Icons.info,
                  color: AppColors.pink,
                  size: 52,
                ),
                const SizedBox(height: 10),
                Text(
                  'Book by phone',
                  style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                Text(
                  '+45 423 445 99',
                  style: TextStyle(color: Colors.green[800], fontSize: 20),
                ),
                const Text(
                  'Monday to Friday 9.00am - 7.30pm',
                  style: TextStyle(color: Colors.black, fontSize: 14),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
