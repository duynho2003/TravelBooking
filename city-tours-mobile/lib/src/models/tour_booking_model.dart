class TourBooking {
  final int tourId;
  final String startTime;
  final int adults;
  final int children;
  final int baby;
  final double discount;
  final double totalAmount;

  TourBooking({
    required this.tourId,
    required this.startTime,
    required this.adults,
    required this.children,
    required this.baby,
    required this.discount,
    required this.totalAmount,
  });
}
