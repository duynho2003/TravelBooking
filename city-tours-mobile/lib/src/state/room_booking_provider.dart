import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/room_booking_model.dart';

class RoomBookingProvider with ChangeNotifier {
  RoomBooking? _roomBooking;

  RoomBooking? get booking => _roomBooking;

  void setRoomBooking(RoomBooking roomBooking) {
    _roomBooking = roomBooking;
    notifyListeners();
  }

  void clearRoomBooking() {
    _roomBooking = null;
    notifyListeners();
  }

  RoomBooking? getRoomBookingInfo() {
    return _roomBooking;
  }
}
