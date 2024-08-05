class Hotel {
  final int id;
  final String name;
  final String description;
  final String address;
  final double rating;
  final String activeStatus;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String provinceName;
  final String regionName;
  final List<String> thumbnailUrls;
  final List<Room> rooms;

  Hotel({
    required this.id,
    required this.name,
    required this.description,
    required this.address,
    required this.rating,
    required this.activeStatus,
    required this.createdAt,
    required this.updatedAt,
    required this.provinceName,
    required this.regionName,
    required this.thumbnailUrls,
    required this.rooms,
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      address: json['address'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      activeStatus: json['activeStatus'] ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      provinceName: json['provinceName'] ?? '',
      regionName: json['regionName'] ?? '',
      thumbnailUrls: List<String>.from(json['thumbnailUrls'] ?? []),
      rooms: (json['rooms'] as List<dynamic>? ?? [])
          .map((roomJson) => Room.fromJson(roomJson as Map<String, dynamic>))
          .toList(),
    );
  }
}

class Room {
  final int id;
  final String roomNumber;
  final String type;
  final String category;
  final double defaultPrice;
  final double weekdayPrice;
  final double weekendPrice;
  final double discount;
  final int quantityAdult;
  final int quantityChild;
  final double childCharge;
  final int quantityBaby;
  final double babyCharge;
  final String bookedStatus;
  final String activeStatus;
  final List<String> imageUrls;

  Room({
    required this.id,
    required this.roomNumber,
    required this.type,
    required this.category,
    required this.defaultPrice,
    required this.weekdayPrice,
    required this.weekendPrice,
    required this.discount,
    required this.quantityAdult,
    required this.quantityChild,
    required this.childCharge,
    required this.quantityBaby,
    required this.babyCharge,
    required this.bookedStatus,
    required this.activeStatus,
    required this.imageUrls,
  });

  factory Room.fromJson(Map<String, dynamic> json) {
    return Room(
      id: json['id'] ?? 0,
      roomNumber: json['roomNumber'] ?? '',
      type: json['type'] ?? '',
      category: json['category'] ?? '',
      defaultPrice: (json['defaultPrice'] as num?)?.toDouble() ?? 0.0,
      weekdayPrice: (json['weekdayPrice'] as num?)?.toDouble() ?? 0.0,
      weekendPrice: (json['weekendPrice'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      quantityAdult: json['quantityAdult'] ?? 0,
      quantityChild: json['quantityChild'] ?? 0,
      childCharge: (json['childCharge'] as num?)?.toDouble() ?? 0.0,
      quantityBaby: json['quantityBaby'] ?? 0,
      babyCharge: (json['babyCharge'] as num?)?.toDouble() ?? 0.0,
      bookedStatus: json['bookedStatus'] ?? '',
      activeStatus: json['activeStatus'] ?? '',
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
    );
  }
}
