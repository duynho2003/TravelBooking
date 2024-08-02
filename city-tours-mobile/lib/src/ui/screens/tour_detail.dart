import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_booking_model.dart';
import 'package:flutter_application_1/src/models/tour_review_model.dart';
import 'package:flutter_application_1/src/models/user_model.dart';
import 'package:flutter_application_1/src/services/tour_review_api.dart';
import 'package:flutter_application_1/src/services/user_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/state/tour_booking_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/utils/date_formatter.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/models/tour_model.dart';
import 'package:flutter_application_1/src/services/tour_api.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';

class TourDetail extends StatefulWidget {
  final int tourId;

  const TourDetail({super.key, required this.tourId});

  @override
  State<TourDetail> createState() => _TourDetailState();
}

class _TourDetailState extends State<TourDetail> {
  late Future<Tour> _tourFuture;
  late Future<List<TourReview>> _reviewsFuture;
  late Future<UserModel> _userModelFuture;
  final TourApi _tourApi = TourApi();
  final TourReviewApi _reviewApi = TourReviewApi();
  bool _showFullDetail = false;
  bool _canLeaveReview = false;
  int _selectedIndex = 1;

  UserModel? _userModel;

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

  String _truncateHtml(String html, {int maxLength = 200}) {
    if (html.length > maxLength) {
      return '${html.substring(0, maxLength)}...';
    } else {
      return html;
    }
  }

  // Các biến cần thiết cho booking
  int quantityAdults = 1;
  int quantityChildren = 0;
  int quantityBaby = 0;
  List<String>? dataStartTimes;
  String? errorStartTime;
  String? selectedStartTime;

  late TextEditingController _adultController;
  late TextEditingController _childController;
  late TextEditingController _babyController;

  @override
  void initState() {
    super.initState();
    _userModelFuture = _fetchUserProfile();
    _tourFuture = _tourApi.getTourById(tourId: widget.tourId);
    _reviewsFuture = _reviewApi.fetchTourReviews(tourId: widget.tourId);
    _adultController = TextEditingController(text: quantityAdults.toString());
    _childController = TextEditingController(text: quantityChildren.toString());
    _babyController = TextEditingController(text: quantityBaby.toString());
  }

  @override
  void dispose() {
    _adultController.dispose();
    _childController.dispose();
    _babyController.dispose();
    super.dispose();
  }

  Future<UserModel> _fetchUserProfile() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.userId;
    final userApi = UserApi();
    final userModel = await userApi.getProfileByUserId(context, userId);
    _checkReviewStatus(userModel.tourBookings ?? []);
    setState(() {
      _userModel = userModel;
    });
    return userModel;
  }

  void _checkReviewStatus(List<TourBookingModel> bookings) {
    print('Checking Review Status for Bookings:');
    bookings.forEach((booking) {
      print(
          'Booking ID: ${booking.id}, Tour ID: ${booking.tourId}, Review Status: ${booking.reviewStatus}, Booking Status: ${booking.bookingStatus}');
    });

    final hasActiveBooking = bookings.any((booking) =>
        booking.tourId == widget.tourId &&
        booking.reviewStatus == 'NOT_PROVIDED');

    // Debugging: Print if there's an active booking
    print('Has Active Booking for Review: $hasActiveBooking');

    setState(() {
      _canLeaveReview = hasActiveBooking;
    });
  }

  void _showReviewDialog(UserModel userModel, Tour tour) {
    final TextEditingController _nameController =
        TextEditingController(text: userModel.customer?.name);
    final TextEditingController _emailController =
        TextEditingController(text: userModel.email);
    final TextEditingController _contentController = TextEditingController();
    double _rating = 0.0;
    TourBookingModel? _selectedTourBooking;

    // Extract tour bookings from userModel
    final List<TourBookingModel>? tourBookings = userModel.tourBookings;

    // If tourBookings is null, default to an empty list
    final List<TourBookingModel> nonNullableTourBookings = tourBookings ?? [];

    // Extract start times from tour bookings
    final List<String> startTimes = nonNullableTourBookings
        .map((booking) => booking.startTime)
        .toSet() // Ensure unique start times
        .toList();

    // Create a mapping from start times to TourBookingModel IDs
    final Map<String, TourBookingModel> startTimeToBooking = {
      for (var booking in nonNullableTourBookings) booking.startTime: booking
    };

    // Get the tour's start times
    final List<TourTime> tourTimes = tour.tourTimes;

    // Extract start times from tourTimes (assuming you want to use startDate for comparison)
    final List<String> tourStartTimes = tourTimes
        .map((time) => time.startDate)
        .toSet() // Ensure unique start times
        .toList();

    // Filter start times to only include those that match the tour's start times
    final List<String> filteredStartTimes = startTimes
        .where((startTime) => tourStartTimes.contains(startTime))
        .toList();

    showDialog(
      context: context,
      builder: (BuildContext context) {
        final double dialogWidth = MediaQuery.of(context).size.width - 20;

        return Dialog(
          child: Container(
            width: dialogWidth,
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Write a Review',
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                  ),
                  enabled: false,
                ),
                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                  enabled: false,
                ),
                TextField(
                  controller: _contentController,
                  decoration: const InputDecoration(labelText: 'Content'),
                  maxLines: 3,
                ),
                const SizedBox(height: 10),
                RatingBar.builder(
                  initialRating: 0,
                  minRating: 1,
                  direction: Axis.horizontal,
                  allowHalfRating: true,
                  itemCount: 5,
                  itemSize: 20,
                  itemPadding: const EdgeInsets.symmetric(horizontal: 4.0),
                  itemBuilder: (context, _) => const Icon(
                    Icons.star,
                    color: Colors.amber,
                  ),
                  onRatingUpdate: (rating) {
                    _rating = rating;
                  },
                ),
                const SizedBox(height: 10),
                DropdownButton<String>(
                  value: _selectedTourBooking?.startTime,
                  hint: const Text('Select Start Time'),
                  items: filteredStartTimes.map((String startTime) {
                    return DropdownMenuItem<String>(
                      value: startTime,
                      child: Text(startTime),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    setState(() {
                      _selectedTourBooking = startTimeToBooking[newValue!];
                    });
                  },
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      child: const Text('Cancel'),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                    TextButton(
                      child: const Text('Submit'),
                      onPressed: () {
                        if (_nameController.text.isEmpty ||
                            _emailController.text.isEmpty ||
                            _contentController.text.isEmpty ||
                            _rating <= 0 ||
                            _selectedTourBooking == null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                  'Please fill all fields, provide a rating, and select a start time.'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }

                        final review = TourReview(
                          userId: _userModel!.id,
                          tourId: tour.id.toInt(),
                          customerName: _nameController.text,
                          tourBookingId: _selectedTourBooking!.id,
                          content: _contentController.text,
                          rating: _rating,
                        );

                        _submitReview(review);

                        Navigator.of(context).pop();
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: FutureBuilder<Tour>(
        future: _tourFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('No tour data available'));
          } else {
            final tour = snapshot.data!;

            return SingleChildScrollView(
                child: Container(
              color: AppColors.border,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoSection(tour),
                  const SizedBox(height: 10),
                  _buildDetailSection(tour),
                  const SizedBox(height: 10),
                  _buildBookingSection(tour),
                  const SizedBox(height: 10),
                  _buildReviewsSection(tour),
                  const SizedBox(height: 10),
                  _buildContactSection(tour),
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

  Widget _buildInfoSection(Tour tour) {
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
                    tour.thumbnail,
                    fit: BoxFit.cover,
                    width: double.infinity,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Tour Name
                    Text(
                      tour.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 5),

                    // Rating and Departure
                    Row(
                      children: [
                        Row(
                          children: [
                            RatingBarIndicator(
                              rating: tour.rating,
                              itemBuilder: (context, index) => const Icon(
                                Icons.star,
                                color: Colors.amber,
                              ),
                              itemCount: 5,
                              itemSize: 20.0,
                              direction: Axis.horizontal,
                            ),
                          ],
                        ),
                        const Spacer(),
                        // Departure Information
                        Text(
                          "Depart: ${tour.depart}",
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),

                    const SizedBox(height: 5),

                    // Price Information
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Map tour",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.green,
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            if (tour.discount > 0) ...[
                              Text(
                                formatCurrency(tour.priceAdult - tour.discount),
                                style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.greenDark),
                              ),
                              Text(
                                formatCurrency(tour.priceAdult),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w400,
                                  color: AppColors.grayLight,
                                  fontStyle: FontStyle.italic,
                                  decoration: TextDecoration.lineThrough,
                                ),
                              ),
                            ] else ...[
                              Text(
                                formatCurrency(tour.priceAdult),
                                style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.greenDark),
                              ),
                            ],
                          ],
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailSection(Tour tour) {
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
                "Detail",
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
                      ? tour.detail
                      : _truncateHtml(tour.detail),
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

  Widget _buildBookingSection(Tour tour) {
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
                    const SizedBox(height: 10),
                    _buildQuantitySection(tour),
                    const SizedBox(height: 20),
                    _buildPriceSection(tour),
                    const SizedBox(height: 10),
                    _buildDiscountSection(tour),
                    const SizedBox(height: 10),
                    _buildTotalAmountSection(tour),
                    const SizedBox(height: 10),
                    _buildButtons(tour),
                    const SizedBox(height: 5),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildReviewsSection(Tour tour) {
    return FutureBuilder<List<TourReview>>(
      future: _reviewsFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        } else if (snapshot.hasError) {
          return Container(
            width: double.infinity,
            color: AppColors.white,
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Reviews",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (_canLeaveReview)
                    CustomButton(
                      backgroundColor: AppColors.greenDark,
                      textColor: AppColors.white,
                      text: 'Leave a Review',
                      hoverColor: Colors.lightBlue,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      onPressed: () => _userModel != null
                          ? _showReviewDialog(_userModel!, tour)
                          : null,
                    ),
                  const SizedBox(height: 10),
                  Center(
                    child: Text(
                      'No reviews found',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ),
                ],
              ),
            ),
          );
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Container(
            width: double.infinity,
            color: AppColors.white,
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Reviews",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  if (_canLeaveReview)
                    CustomButton(
                      backgroundColor: AppColors.greenDark,
                      textColor: AppColors.white,
                      text: 'Leave a Review',
                      hoverColor: Colors.lightBlue,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      onPressed: () => _userModel != null
                          ? _showReviewDialog(_userModel!, tour)
                          : null,
                    ),
                  const SizedBox(height: 10),
                  Center(
                    child: Text(
                      'No reviews found',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                  ),
                ],
              ),
            ),
          );
        } else {
          final reviews = snapshot.data!;

          reviews.sort((a, b) {
            final dateA = a.createdAt ?? DateTime(1900);
            final dateB = b.createdAt ?? DateTime(1900);
            return dateB.compareTo(dateA);
          });

          return Container(
            width: double.infinity,
            color: AppColors.white,
            child: Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text(
                        "Reviews",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 5),
                      Text(
                        "(${tour.rating.toStringAsFixed(1)})",
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppColors.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  if (_canLeaveReview)
                    CustomButton(
                      backgroundColor: AppColors.greenDark,
                      textColor: AppColors.white,
                      text: 'Leave a Review',
                      hoverColor: Colors.lightBlue,
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      onPressed: () => _userModel != null
                          ? _showReviewDialog(_userModel!, tour)
                          : null,
                    ),
                  const SizedBox(height: 10),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: reviews.length,
                    itemBuilder: (context, index) {
                      final review = reviews[index];
                      return ListTile(
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 8.0),
                        title: Text(review.customerName),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            RatingBarIndicator(
                              rating: review.rating,
                              itemBuilder: (context, index) => const Icon(
                                Icons.star,
                                color: Colors.amber,
                              ),
                              itemCount: 5,
                              itemSize: 16.0,
                              direction: Axis.horizontal,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              review.content,
                              style: const TextStyle(fontSize: 14),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              // 'Posted on: ${formatDate(review.createdAt)}',
                              'Posted on: ${formatDate(review.createdAt ?? DateTime.now())}',
                              style: const TextStyle(
                                  fontSize: 12, color: Colors.grey),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          );
        }
      },
    );
  }

  void _submitReview(TourReview review) async {
    try {
      print("Submitting review: ${review.toString()}");

      // Call the createTourReview function and await its result
      final message = await _reviewApi.createTourReview(
        context: context,
        tourReview: review,
      );

      // Refresh the reviews list after submission
      setState(() {
        _canLeaveReview = false;
        _tourFuture = _tourApi.getTourById(tourId: widget.tourId);
        _reviewsFuture = _reviewApi.fetchTourReviews(tourId: widget.tourId);
      });

      // Show success message using Snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message), // Display the message from API response
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error submitting review: $e');

      // Show error message using Snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content:
              Text('Error submitting review: $e'), // Display the error message
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildContactSection(Tour tour) {
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

  Widget _buildQuantitySection(Tour tour) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (tour.tourTimes.isNotEmpty)
          SizedBox(
              width: double.infinity,
              child: DropdownButtonFormField<String>(
                value: selectedStartTime,
                hint: const Text(
                  "Time",
                  style: TextStyle(fontSize: 12),
                ),
                items: tour.tourTimes.map((tourTime) {
                  return DropdownMenuItem<String>(
                    value: tourTime.startDate,
                    child: Text(
                      tourTime.startDate,
                      style: const TextStyle(fontSize: 12),
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    selectedStartTime = value;
                  });
                },
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  contentPadding:
                      EdgeInsets.symmetric(vertical: 4.0, horizontal: 12.0),
                ),
              )),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Adults (${tour.adults})',
                    style: const TextStyle(
                        color: AppColors.grayText, fontSize: 12),
                  ),
                  _buildQuantityPicker(
                    value: quantityAdults,
                    minValue: 1,
                    maxValue: tour.adults,
                    onChanged: (value) =>
                        setState(() => quantityAdults = value),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Children (${tour.children})',
                    style: const TextStyle(
                        color: AppColors.grayText, fontSize: 12),
                  ),
                  _buildQuantityPicker(
                    value: quantityChildren,
                    minValue: 0,
                    maxValue: tour.children,
                    onChanged: (value) =>
                        setState(() => quantityChildren = value),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 3),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Baby (${tour.baby})',
                    style: const TextStyle(
                        color: AppColors.grayText, fontSize: 12),
                  ),
                  _buildQuantityPicker(
                    value: quantityBaby,
                    minValue: 0,
                    maxValue: tour.baby,
                    onChanged: (value) => setState(() => quantityBaby = value),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuantityPicker({
    required int value,
    required int minValue,
    required int maxValue,
    required ValueChanged<int> onChanged,
  }) {
    TextEditingController controller;

    // Determine which controller to use based on value
    if (value == quantityAdults) {
      controller = _adultController;
    } else if (value == quantityChildren) {
      controller = _childController;
    } else {
      controller = _babyController;
    }

    // Ensure controller text is always in sync with quantity value
    controller.text = value.toString();

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          icon: const Icon(
            Icons.remove,
            size: 16,
          ),
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
          onPressed: () {
            if (value > minValue) {
              setState(() {
                onChanged(value - 1);
              });
            }
          },
        ),
        SizedBox(
          width: 20,
          child: TextField(
            keyboardType: TextInputType.number,
            textAlign: TextAlign.center,
            controller: controller,
            onChanged: (text) {
              final intValue = int.tryParse(text);
              if (intValue != null &&
                  intValue >= minValue &&
                  intValue <= maxValue) {
                setState(() {
                  onChanged(intValue);
                });
              }
            },
            style: const TextStyle(
              fontSize: 14,
            ),
          ),
        ),
        IconButton(
          icon: const Icon(
            Icons.add,
            size: 16,
          ),
          padding: EdgeInsets.zero,
          constraints: const BoxConstraints(),
          onPressed: () {
            if (value < maxValue) {
              setState(() {
                onChanged(value + 1);
              });
            }
          },
        ),
      ],
    );
  }

  Widget _buildPriceSection(Tour tour) {
    return Column(
      children: [
        _buildPriceRow(
            'Adults', quantityAdults, tour.priceAdult, tour.discount),
        _buildPriceRow(
            'Children', quantityChildren, tour.priceChild, tour.discount),
        _buildPriceRow('Baby', quantityBaby, tour.priceBaby, tour.discount,
            isFree: tour.priceBaby == 0),
      ],
    );
  }

  Widget _buildPriceRow(
      String label, int quantity, double price, double discount,
      {bool isFree = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          '$label ($quantity x ${isFree ? "Free" : formatCurrency(price - discount)})',
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
        Text(
          formatCurrency(quantity * (isFree ? price : (price - discount))),
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildDiscountSection(Tour tour) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Discount',
          style: TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
        Text(
          formatCurrency(tour.discount),
          style: const TextStyle(color: AppColors.grayMid, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildTotalAmountSection(Tour tour) {
    final totalAmount = (quantityAdults * (tour.priceAdult - tour.discount)) +
        (quantityChildren * (tour.priceChild - tour.discount)) +
        (quantityBaby *
            (tour.priceBaby == 0
                ? tour.priceBaby
                : tour.priceBaby - tour.discount));

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Total amount',
          style: TextStyle(
              color: AppColors.grayMid,
              fontSize: 16,
              fontWeight: FontWeight.bold),
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

  Widget _buildButtons(Tour tour) {
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
            onPressed: () => handleNavigateCheckout(context, tour.id),
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
            onPressed: () => handleAddWishlist(tour.id),
            paddingTop: 20,
            paddingBottom: 20,
            borderWidth: 1,
            borderColor: AppColors.greenDark,
          ),
        ),
      ],
    );
  }

  void handleNavigateCheckout(BuildContext context, int tourId) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    print('AuthProvider.isAuthenticated: ${authProvider.isAuthenticated}');
    print('AuthProvider.token: ${authProvider.token}');
    print('AuthProvider.username: ${authProvider.username}');
    print('AuthProvider.userId: ${authProvider.userId}');

    if (!authProvider.isAuthenticated) {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      Navigator.pushNamed(context, '/login');
      return;
    }

    if (selectedStartTime == null) {
      setState(() {
        errorStartTime = "Please choose start time";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please choose start time'),
          backgroundColor: Colors.red,
        ),
      );
      print('Error: Start time is not selected');
      return;
    }

    // Tính toán tổng số tiền
    _tourFuture.then((tour) {
      final totalAmount = (quantityAdults * (tour.priceAdult - tour.discount)) +
          (quantityChildren * (tour.priceChild - tour.discount)) +
          (quantityBaby *
              (tour.priceBaby == 0
                  ? tour.priceBaby
                  : tour.priceBaby - tour.discount));

      // Tạo booking object
      final tourBooking = TourBooking(
        tourId: tourId,
        startTime: selectedStartTime!,
        adults: quantityAdults,
        children: quantityChildren,
        baby: quantityBaby,
        discount: tour.discount,
        totalAmount: totalAmount,
      );

      // Log thông tin booking
      print('Booking Information:');
      print('Tour ID: ${tourBooking.tourId}');
      print('Start Time: ${tourBooking.startTime}');
      print('Adults: ${tourBooking.adults}');
      print('Children: ${tourBooking.children}');
      print('Baby: ${tourBooking.baby}');
      print('Discount: ${tourBooking.discount}');
      print('Total Amount: ${tourBooking.totalAmount}');

      // Lưu booking vào provider
      final tourBookingProvider =
          Provider.of<TourBookingProvider>(context, listen: false);
      tourBookingProvider.setTourBooking(tourBooking);

      // Điều hướng đến trang checkout
      Navigator.pushNamed(context, '/checkout', arguments: tourId);
    }).catchError((error) {
      // Xử lý lỗi
      print('An error occurred: $error');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred: $error')),
      );
    });
  }

  void handleAddWishlist(int tourId) {
    // Add to wishlist logic
  }
}
