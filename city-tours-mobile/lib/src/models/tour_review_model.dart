class TourReview {
  final int? id;
  final int? userId;
  final int? tourId;
  final int? tourBookingId;
  final String customerName;
  final String content;
  final double rating;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  TourReview({
    this.id,
    this.userId,
    this.tourId,
    this.tourBookingId,
    required this.customerName,
    required this.content,
    required this.rating,
    this.createdAt,
    this.updatedAt,
  });

  factory TourReview.fromJson(Map<String, dynamic> json) {
    return TourReview(
      id: json['id'] ?? 0,
      userId: json['userId'] ?? 0,
      tourId: json['tourId'] ?? 0,
      tourBookingId: json['tourBookingId'] ?? 0,
      customerName: json['customerName'] ?? '',
      content: json['content'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  @override
  String toString() {
    return 'TourReview(userId: $userId, tourId: $tourId, customerName: $customerName, '
        'tourBookingId: $tourBookingId, content: $content, rating: $rating)';
  }
}
