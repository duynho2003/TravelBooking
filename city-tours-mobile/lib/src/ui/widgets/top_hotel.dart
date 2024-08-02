import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/models/hotel_model.dart';
import 'package:flutter_application_1/src/services/hotel_api.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

class TopHotel extends StatefulWidget {
  const TopHotel({super.key});

  @override
  State<TopHotel> createState() => _TopHotelState();
}

class _TopHotelState extends State<TopHotel> {
  late Future<List<Hotel>> _toursFuture;
  final HotelApi _tourApi = HotelApi();

  @override
  void initState() {
    super.initState();
    _toursFuture = _fetchTours();
  }

  Future<List<Hotel>> _fetchTours() async {
    try {
      return await _tourApi.fetchHotels();
    } catch (e) {
      print('Error fetching hotels: $e');
      return [];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        const Center(
          child: Text(
            'Top Hotel',
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.grayText),
          ),
        ),
        const SizedBox(height: 10),
        FutureBuilder<List<Hotel>>(
          future: _toursFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No tours available'));
            } else {
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 5,
                  mainAxisSpacing: 5,
                  childAspectRatio: 1.0,
                ),
                itemCount: snapshot.data!.length,
                itemBuilder: (BuildContext context, int index) {
                  Hotel hotel = snapshot.data![index];
                  return Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20.0),
                      child: Stack(
                        fit: StackFit.expand,
                        children: <Widget>[
                          Image.network(
                            hotel.thumbnailUrls.first,
                            fit: BoxFit.cover,
                          ),
                          Positioned(
                            bottom: 0,
                            left: 0,
                            right: 0,
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10.0),
                                gradient: AppColors.linearGradientBackground,
                              ),
                              padding: const EdgeInsets.all(10),
                              alignment: Alignment.center,
                              child: Column(
                                children: <Widget>[
                                  Text(
                                    hotel.name,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 5),
                                  RatingBarIndicator(
                                    rating: 5.0,
                                    itemBuilder: (context, index) => const Icon(
                                      Icons.star,
                                      color: Colors.amber,
                                    ),
                                    itemCount: 5,
                                    itemSize: 14,
                                    direction: Axis.horizontal,
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
              );
            }
          },
        ),
        const SizedBox(height: 10),
        const Center(
          child: CustomButton(
            backgroundColor: AppColors.greenDark,
            textColor: AppColors.white,
            text: 'All Hotels',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: FontWeight.w600,
            routeName: '/hotels_list',
          ),
        ),
      ],
    );
  }
}
