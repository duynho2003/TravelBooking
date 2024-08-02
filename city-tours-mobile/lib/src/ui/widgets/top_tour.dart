import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';
import 'package:flutter_application_1/src/models/tour_model.dart';
import 'package:flutter_application_1/src/services/tour_api.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_application_1/src/utils/currency_formatter.dart';

class TopTour extends StatefulWidget {
  const TopTour({super.key});

  @override
  State<TopTour> createState() => _TopTourState();
}

class _TopTourState extends State<TopTour> {
  late Future<List<Tour>> _toursFuture;
  final TourApi _tourApi = TourApi();

  @override
  void initState() {
    super.initState();
    _toursFuture = _fetchTours();
  }

  Future<List<Tour>> _fetchTours() async {
    try {
      return await _tourApi.fetchTours();
    } catch (e) {
      print('Error fetching tours: $e');
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
            'Top Tours',
            style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.grayText),
          ),
        ),
        const SizedBox(height: 10),
        FutureBuilder<List<Tour>>(
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
                  Tour tour = snapshot.data![index];
                  return GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(
                        context,
                        '/tour_detail',
                        arguments: tour.id,
                      );
                    },
                    child: Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20.0),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(20.0),
                        child: Stack(
                          fit: StackFit.expand,
                          children: <Widget>[
                            Image.network(
                              tour.thumbnail,
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
                                      tour.name,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 5),
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        RatingBarIndicator(
                                          rating: tour.rating,
                                          itemBuilder: (context, index) =>
                                              const Icon(
                                            Icons.star,
                                            color: Colors.amber,
                                          ),
                                          itemCount: 5,
                                          itemSize: 12,
                                          direction: Axis.horizontal,
                                        ),
                                        const SizedBox(height: 5),
                                        Column(
                                          children: [
                                            Text(
                                              formatCurrency(tour.priceAdult -
                                                  (tour.discount > 0
                                                      ? tour.discount
                                                      : 0)),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.white,
                                              ),
                                            ),
                                            if (tour.discount > 0)
                                              Text(
                                                formatCurrency(tour.priceAdult),
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  color: AppColors.grayLight,
                                                  fontStyle: FontStyle.italic,
                                                  decoration: TextDecoration
                                                      .lineThrough,
                                                  decorationColor:
                                                      AppColors.white,
                                                ),
                                              ),
                                          ],
                                        )
                                      ],
                                    )
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
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
            text: 'All Tours',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: FontWeight.w600,
            routeName: '/tours_list',
          ),
        ),
      ],
    );
  }
}
