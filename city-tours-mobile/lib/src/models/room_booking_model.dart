class RoomBooking {
  final int roomId;
  final String roomType;
  final String roomNumber;
  final String startDate;
  final String endDate;
  final double discount;
  final double price;
  final double totalAmount;
  final String hotelName;

  RoomBooking({
    required this.roomId,
    required this.roomType,
    required this.roomNumber,
    required this.startDate,
    required this.endDate,
    required this.discount,
    required this.price,
    required this.totalAmount,
    required this.hotelName,
  });
}
