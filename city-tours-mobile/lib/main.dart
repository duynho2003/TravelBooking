import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/state/room_booking_provider.dart';
import 'package:flutter_application_1/src/state/tour_booking_provider.dart';
import 'package:flutter_application_1/src/ui/screens/blog_detail.dart';
import 'package:flutter_application_1/src/ui/screens/blog_list.dart';
import 'package:flutter_application_1/src/ui/screens/hotel_detail.dart';
import 'package:flutter_application_1/src/ui/screens/room_bookings.dart';
import 'package:flutter_application_1/src/ui/screens/tour_checkout_success.dart';
import 'package:flutter_application_1/src/ui/screens/hotel_list.dart';
import 'package:flutter_application_1/src/ui/screens/profile.dart';
import 'package:flutter_application_1/src/ui/screens/tour_bookings.dart';
import 'package:flutter_application_1/src/ui/screens/tour_checkout.dart';
import 'package:flutter_application_1/src/ui/screens/tour_detail.dart';
import 'package:flutter_application_1/src/ui/screens/tour_list.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/services.dart';
import 'package:flutter_application_1/src/ui/screens/home.dart';
import 'package:flutter_application_1/src/ui/screens/register.dart';
import 'package:flutter_application_1/src/ui/screens/login.dart';
import 'package:flutter_application_1/src/ui/screens/room_checkout.dart';
import 'package:flutter_application_1/src/ui/screens/room_checkout_success.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
          ChangeNotifierProvider(create: (_) => TourBookingProvider()),
          ChangeNotifierProvider(create: (_) => RoomBookingProvider()),
        ],
        child: MaterialApp(
          title: "City Tours",
          theme: ThemeData(
            textTheme: GoogleFonts.montserratTextTheme(),
            primarySwatch: Colors.blue,
          ),
          home: const Home(),
          onGenerateRoute: (settings) {
            switch (settings.name) {
              // Auth
              case '/register':
                return MaterialPageRoute(
                    builder: (context) => const Register());
              case '/login':
                return MaterialPageRoute(builder: (context) => const Login());
              case '/profile':
                return MaterialPageRoute(builder: (context) => const Profile());

              // Tour
              case '/tour_detail':
                final int tourId = settings.arguments as int;
                return MaterialPageRoute(
                  builder: (context) => TourDetail(tourId: tourId),
                );
              case '/tours_list':
                return MaterialPageRoute(
                  builder: (context) => const TourList(),
                );
              case '/tour_bookings':
                return MaterialPageRoute(
                  builder: (context) => const TourBookings(),
                );

              // Hotel
              case '/hotels_list':
                return MaterialPageRoute(
                  builder: (context) => const HotelList(),
                );
              case '/hotel_detail':
                final int hotelId = settings.arguments as int;
                return MaterialPageRoute(
                  builder: (context) => HotelDetail(hotelId: hotelId),
                );
              case '/room_bookings':
                return MaterialPageRoute(
                  builder: (context) => const RoomBookings(),
                );

              // Payment
              case '/tour_checkout':
                final int tourId = settings.arguments as int;
                return MaterialPageRoute(
                  builder: (context) => TourCheckout(tourId: tourId),
                );
              case '/tour_checkout_success':
                final args = settings.arguments as Map<String, dynamic>?;
                return MaterialPageRoute(
                  builder: (context) => CheckoutSuccess(bookingData: args),
                );
              case '/room_checkout':
                final int roomId = settings.arguments as int;
                return MaterialPageRoute(
                  builder: (context) => RoomCheckout(roomId: roomId),
                );
              case '/room_checkout_success':
                final args = settings.arguments as Map<String, dynamic>?;
                return MaterialPageRoute(
                  builder: (context) => RoomCheckoutSuccess(bookingData: args),
                );

              // Blog
              case '/blogs_list':
                return MaterialPageRoute(
                  builder: (context) => const BlogList(),
                );
              case '/blog_detail':
                final int blogId = settings.arguments as int;
                return MaterialPageRoute(
                  builder: (context) => BlogDetail(blogId: blogId),
                );

              default:
                return MaterialPageRoute(builder: (context) => const Home());
            }
          },
          debugShowCheckedModeBanner: false,
        ));
  }
}
