import 'package:flutter_application_1/src/models/customer_model.dart';

class UserModel {
  final int id;
  final String username;
  final String email;
  final String status;
  final DateTime? createdAt;
  final DateTime? updatedAt;
  final CustomerModel? customer;
  final List<RoomBookingModel>? roomBookings;
  final List<TourBookingModel>? tourBookings;
  final List<String>? roles;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.status,
    this.createdAt,
    this.updatedAt,
    this.customer,
    this.roomBookings,
    this.tourBookings,
    this.roles,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      status: json['status'],
      createdAt:
          json['createAt'] != null ? DateTime.parse(json['createAt']) : null,
      updatedAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
      customer: json['customer'] != null
          ? CustomerModel.fromJson(json['customer'])
          : null,
      roomBookings: json['roomBookings'] != null
          ? List<RoomBookingModel>.from(
              json['roomBookings'].map((x) => RoomBookingModel.fromJson(x)))
          : null,
      tourBookings: json['tourBookings'] != null
          ? List<TourBookingModel>.from(
              json['tourBookings'].map((x) => TourBookingModel.fromJson(x)))
          : null,
      roles: json['roles'] != null ? List<String>.from(json['roles']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'status': status,
      'createAt': createdAt?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'customer': customer?.toJson(),
      'roomBookings': roomBookings?.map((x) => x.toJson()).toList(),
      'tourBookings': tourBookings?.map((x) => x.toJson()).toList(),
      'roles': roles,
    };
  }
}

class RoomBookingModel {
  final int id;
  final DateTime startDate;
  final DateTime endDate;
  final double price;
  final String reviewStatus;
  final String roomType;
  final String roomNumber;
  final String? hotelName;
  final int customerId;
  final int roomId;
  final DateTime createdAt;
  final DateTime updatedAt;

  RoomBookingModel({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.reviewStatus,
    required this.roomType,
    required this.roomNumber,
    this.hotelName,
    required this.customerId,
    required this.roomId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory RoomBookingModel.fromJson(Map<String, dynamic> json) {
    return RoomBookingModel(
      id: json['id'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      price: json['price'].toDouble(),
      reviewStatus: json['reviewStatus'],
      roomType: json['roomType'],
      roomNumber: json['roomNumber'],
      hotelName: json['hotelName'],
      customerId: json['customerId'],
      roomId: json['roomId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'price': price,
      'reviewStatus': reviewStatus,
      'roomType': roomType,
      'roomNumber': roomNumber,
      'hotelName': hotelName,
      'customerId': customerId,
      'roomId': roomId,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class TourBookingModel {
  final int id;
  final int tourId;
  final String tourName;
  final int customerId;
  final String customerName;
  final int adults;
  final int children;
  final int babies;
  final double amount;
  final String bookingStatus;
  final String reviewStatus;
  final String startTime;
  final DateTime createdAt;
  final DateTime updatedAt;

  TourBookingModel({
    required this.id,
    required this.tourId,
    required this.tourName,
    required this.customerId,
    required this.customerName,
    required this.adults,
    required this.children,
    required this.babies,
    required this.amount,
    required this.bookingStatus,
    required this.reviewStatus,
    required this.startTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TourBookingModel.fromJson(Map<String, dynamic> json) {
    return TourBookingModel(
      id: json['id'],
      tourId: json['tourId'],
      tourName: json['tourName'],
      customerId: json['customerId'],
      customerName: json['customerName'],
      adults: json['adults'],
      children: json['children'],
      babies: json['babies'],
      amount: json['amount'].toDouble(),
      bookingStatus: json['bookingStatus'],
      reviewStatus: json['reviewStatus'],
      startTime: json['startTime'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tourId': tourId,
      'tourName': tourName,
      'customerId': customerId,
      'customerName': customerName,
      'adults': adults,
      'children': children,
      'babies': babies,
      'amount': amount,
      'bookingStatus': bookingStatus,
      'reviewStatus': reviewStatus,
      'startTime': startTime,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
