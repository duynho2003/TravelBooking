class RoomBookingCustomer {
  final int id;
  final String startDate;
  final String endDate;
  final double price;
  final String customerName;
  final String reviewStatus;
  final String roomType;
  final String roomNumber;
  final String hotelName;
  final int customerId;
  final int roomId;

  RoomBookingCustomer({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.customerName,
    required this.reviewStatus,
    required this.roomType,
    required this.roomNumber,
    required this.hotelName,
    required this.customerId,
    required this.roomId,
  });

  factory RoomBookingCustomer.fromJson(Map<String, dynamic> json) {
    return RoomBookingCustomer(
      id: json['id'],
      startDate: json['startDate'],
      endDate: json['endDate'],
      price: json['price'],
      customerName: json['customerName'],
      reviewStatus: json['reviewStatus'],
      roomType: json['roomType'],
      roomNumber: json['roomNumber'],
      hotelName: json['hotelName'],
      customerId: json['customerId'],
      roomId: json['roomId'],
    );
  }
}
