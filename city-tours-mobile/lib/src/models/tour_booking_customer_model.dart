class TourBookingCustomer {
  final int id;
  final int tourId;
  final String tourName;
  final int customerId;
  final String customerName;
  final int adults;
  final int children;
  final int baby;
  final double amount;
  final String? bookingStatus;
  final String? paymentStatus;
  final String? code;
  final String? createdAt;
  final String? updatedAt;
  final String? tourCode;
  final String? thumbnail;
  final String startTime;
  final String? locations;

  TourBookingCustomer({
    required this.id,
    required this.tourId,
    required this.tourName,
    required this.customerId,
    required this.customerName,
    required this.adults,
    required this.children,
    required this.baby,
    required this.amount,
    required this.bookingStatus,
    required this.paymentStatus,
    required this.code,
    required this.createdAt,
    required this.updatedAt,
    this.tourCode,
    this.thumbnail,
    required this.startTime,
    this.locations,
  });

  factory TourBookingCustomer.fromJson(Map<String, dynamic> json) {
    return TourBookingCustomer(
      id: json['id'],
      tourId: json['tourId'],
      tourName: json['tourName'],
      customerId: json['customerId'],
      customerName: json['customerName'],
      adults: json['adults'],
      children: json['children'],
      baby: json['baby'],
      amount: json['amount'].toDouble(),
      bookingStatus: json['bookingStatus'],
      paymentStatus: json['paymentStatus'],
      code: json['code'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      tourCode: json['tourCode'],
      thumbnail: json['thumbnail'],
      startTime: json['startTime'],
      locations: json['locations'],
    );
  }
}
