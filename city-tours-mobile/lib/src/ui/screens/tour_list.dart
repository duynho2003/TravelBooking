import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_model.dart';
import 'package:flutter_application_1/src/services/tour_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';

class TourList extends StatefulWidget {
  const TourList({super.key});

  @override
  State<TourList> createState() => _TourListState();
}

class _TourListState extends State<TourList> {
  int _selectedIndex = 1;
  bool _isFilterVisible = false;
  bool _hasMoreTours = true;
  int _currentPage = 1;
  final int _pageSize = 5;
  final List<Tour> _tours = [];
  late Future<void> _toursFuture;

  final TourApi _tourApi = TourApi();
  String _review = "";
  double _startPrice = 0;
  double _endPrice = 50000000;

  RangeValues _currentRange = const RangeValues(0, 50000000);

  @override
  void initState() {
    super.initState();
    _toursFuture = _fetchTours();
  }

  Future<void> _fetchTours() async {
    try {
      List<Tour> tours = await _tourApi.fetchTours(
        review: _review,
        startPrice: _startPrice.toString(),
        endPrice: _endPrice.toString(),
        page: _currentPage,
        limit: _pageSize,
      );
      setState(() {
        if (tours.isEmpty) {
          _hasMoreTours = false;
        } else {
          _tours.addAll(tours);
          _currentPage++;
        }
      });
    } catch (e) {
      print('Error fetching tours: $e');
      setState(() {
        _hasMoreTours = false;
      });
    }
  }

  void _onReviewSelected(String review) {
    setState(() {
      _review = review;
      _tours.clear();
      _currentPage = 1;
      _hasMoreTours = true;
      _toursFuture = _fetchTours();
    });
  }

  void _onPriceRangeChangeEnd() {
    setState(() {
      _startPrice = _currentRange.start;
      _endPrice = _currentRange.end;
      _tours.clear();
      _currentPage = 1;
      _hasMoreTours = true;
      _toursFuture = _fetchTours();
    });
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
              if (_isFilterVisible) _buildFilterSection(),
              _buildToursListSection(),
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
            'Tours List',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
          ElevatedButton.icon(
            onPressed: () {
              setState(() {
                _isFilterVisible = !_isFilterVisible;
              });
            },
            icon: Icon(
              _isFilterVisible ? Icons.filter_alt_off : Icons.filter_alt,
              color: Colors.white,
            ),
            label: Text(
              _isFilterVisible ? 'Hide Filters' : 'Filters',
              style: TextStyle(color: Colors.white),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.greenDark,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterSection() {
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Review',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppColors.grayText,
            ),
          ),
          const SizedBox(height: 10),
          Column(
            children: [
              _buildRatingOption('All', ''),
              _buildRatingOption('5 star', '5'),
              _buildRatingOption('4 star', '4'),
              _buildRatingOption('3 star', '3'),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Price Range',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.grayText,
                ),
              ),
              Text(
                '${formatCurrency(_currentRange.start)} - ${formatCurrency(_currentRange.end)}',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.grayText,
                ),
              ),
            ],
          ),
          RangeSlider(
            values: _currentRange,
            min: 0,
            max: 50000000,
            divisions: 100,
            activeColor: Colors.pink,
            inactiveColor: Colors.pink.withOpacity(0.3),
            labels: RangeLabels(
              formatCurrency(_currentRange.start),
              formatCurrency(_currentRange.end),
            ),
            onChanged: (RangeValues values) {
              setState(() {
                _currentRange = values;
              });
            },
            onChangeEnd: (RangeValues values) {
              _onPriceRangeChangeEnd();
            },
          )
        ],
      ),
    );
  }

  Widget _buildRatingOption(String text, String value) {
    int stars = 0;
    if (value == '5') {
      stars = 5;
    } else if (value == '4') {
      stars = 4;
    } else if (value == '3') {
      stars = 3;
    }

    return Row(
      mainAxisSize: MainAxisSize.max,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              text,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.grayText,
              ),
            ),
            if (stars > 0) ...[
              const SizedBox(width: 8),
              RatingBarIndicator(
                rating: stars.toDouble(),
                itemBuilder: (context, index) => const Icon(
                  Icons.star,
                  color: Colors.amber,
                ),
                itemCount: 5,
                itemSize: 16,
                direction: Axis.horizontal,
              ),
            ],
          ],
        ),
        Radio<String>(
          value: value,
          groupValue: _review,
          onChanged: (String? newValue) {
            setState(() {
              _review = newValue ?? '';
              _tours.clear();
              _currentPage = 1;
              _hasMoreTours = true;
              _toursFuture = _fetchTours();
            });
          },
        ),
      ],
    );
  }

  Widget _buildToursListSection() {
    if (_tours.isEmpty) {
      return Center(
        child: Text(
          'No tours found',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.grayText,
          ),
        ),
      );
    }

    return SizedBox(
      height: MediaQuery.of(context).size.height,
      child: ListView.builder(
        padding: const EdgeInsets.all(10),
        itemCount: _tours.length + (_hasMoreTours ? 1 : 0),
        itemBuilder: (BuildContext context, int index) {
          if (index == _tours.length) {
            return _hasMoreTours ? _buildLoadMoreButton() : SizedBox.shrink();
          }

          Tour tour = _tours[index];
          return GestureDetector(
            onTap: () {
              Navigator.pushNamed(
                context,
                '/tour_detail',
                arguments: tour.id,
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
                      tour.thumbnail,
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
                          RatingBarIndicator(
                            rating: tour.rating,
                            itemBuilder: (context, index) => const Icon(
                              Icons.star,
                              color: Colors.amber,
                            ),
                            itemCount: 5,
                            itemSize: 16,
                            direction: Axis.horizontal,
                          ),
                          const SizedBox(height: 5),
                          Text(
                            tour.name,
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
                            formatCurrency(tour.priceAdult -
                                (tour.discount > 0 ? tour.discount : 0)),
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: AppColors.greenDark,
                            ),
                          ),
                          if (tour.discount > 0)
                            Text(
                              formatCurrency(tour.priceAdult),
                              style: const TextStyle(
                                fontSize: 10,
                                color: AppColors.grayLight,
                                fontStyle: FontStyle.italic,
                                decoration: TextDecoration.lineThrough,
                                decorationColor: AppColors.grayLight,
                              ),
                            ),
                          const SizedBox(height: 5),
                          Text(
                            "Depart: ${tour.depart}",
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
                            "Start time: ${tour.tourTimes.first.startDate}",
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.grayDark,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
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
          if (_hasMoreTours) {
            _fetchTours();
          }
        },
      ),
    );
  }

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
}
