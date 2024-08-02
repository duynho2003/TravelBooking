class Hotel {
  final int id;
  final String name;
  final String description;
  final String address;
  final double rating;
  final int numberOfRating;
  final String activeStatus;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> thumbnailUrls;

  Hotel({
    required this.id,
    required this.name,
    required this.description,
    required this.address,
    required this.rating,
    required this.numberOfRating,
    required this.activeStatus,
    required this.createdAt,
    required this.updatedAt,
    required this.thumbnailUrls,
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      address: json['address'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      numberOfRating: json['numberOfRating'] ?? 0,
      activeStatus: json['activeStatus'] ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      thumbnailUrls: List<String>.from(json['thumbnailUrls'] ?? []),
    );
  }
}
