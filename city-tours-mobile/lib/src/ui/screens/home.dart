import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/carousel.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/ui/widgets/prominent_hotel_areas.dart';
import 'package:flutter_application_1/src/ui/widgets/top_tour.dart';
import 'package:flutter_application_1/src/ui/widgets/top_hotel.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _selectedIndex = 2;

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
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            const Carousel(),
            Container(
              color: AppColors.bgGrayLight,
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
              child: const ProminentHotelAreas(),
            ),
            Container(
              color: AppColors.bgGrayLight,
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
              child: const TopTour(),
            ),
            Container(
              color: AppColors.bgGrayLight,
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
              child: const TopHotel(),
            ),
          ],
        ),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }
}
