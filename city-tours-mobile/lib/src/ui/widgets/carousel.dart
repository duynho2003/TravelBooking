import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';

class Carousel extends StatefulWidget {
  const Carousel({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _CarouselState createState() => _CarouselState();
}

class _CarouselState extends State<Carousel> {
  int _currentIndex = 0;
  final List<String> _images = [
    'assets/images/slider-1.jpg',
    'assets/images/slider-2.jpg',
    'assets/images/slider-3.jpg',
  ];
  final List<String> _titles = [
    'Explore Phu Quoc Charm on a Cable Car Adventure',
    'Discover the Golden Bridge Tour in Danang',
    'Explore the Beauty of Ho Nui Coc Tour Thai Nguyen - Lang Son',
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      padding: const EdgeInsets.all(10.0),
      // color: AppColors.bgGrayLight,
      decoration: const BoxDecoration(
        color: AppColors.bgGrayLight,
      ),
      child: Stack(
        children: [
          CarouselSlider.builder(
            itemCount: _images.length,
            options: CarouselOptions(
              autoPlay: true,
              enlargeCenterPage: true,
              viewportFraction: 1.0,
              aspectRatio: 16 / 9,
              onPageChanged: (index, reason) {
                setState(() {
                  _currentIndex = index;
                });
              },
            ),
            itemBuilder: (BuildContext context, int index, int realIndex) {
              return _buildCarouselItem(
                imagePath: _images[index],
                title: _titles[index],
              );
            },
          ),
          Positioned.fill(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(_titles[_currentIndex],
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppColors.white,
                    )),
                const SizedBox(height: 10),
                const CustomButton(
                  backgroundColor: AppColors.greenDark,
                  textColor: AppColors.white,
                  text: 'Read more',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  routeName: '/tours_list',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCarouselItem({
    required String imagePath,
    required String title,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Image.asset(
          imagePath,
          width: double.infinity,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
