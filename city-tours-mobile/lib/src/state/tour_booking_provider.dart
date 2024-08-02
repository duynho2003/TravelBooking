import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/tour_booking_model.dart';

class TourBookingProvider with ChangeNotifier {
  TourBooking? _tourBooking;

  TourBooking? get booking => _tourBooking;

  void setTourBooking(TourBooking tourBooking) {
    _tourBooking = tourBooking;
    notifyListeners();
  }

  void clearTourBooking() {
    _tourBooking = null;
    notifyListeners();
  }

  TourBooking? getTourBookingInfo() {
    return _tourBooking;
  }
}
