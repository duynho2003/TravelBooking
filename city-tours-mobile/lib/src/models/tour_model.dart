class Tour {
  final int id;
  final String code;
  final String name;
  final String description;
  final String detail;
  final double priceAdult;
  final double priceChild;
  final double priceBaby;
  final double discount;
  final String depart;
  final double rating;
  final int numberOfRating;
  final int adults;
  final int children;
  final int baby;
  final int quantityCustomerBooking;
  final String thumbnail;
  final String bookedStatus;
  final String activeStatus;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Thêm các trường mới
  final List<TourTime> tourTimes;
  final List<TourLocation> tourLocations;

  Tour({
    required this.id,
    required this.code,
    required this.name,
    required this.description,
    required this.detail,
    required this.priceAdult,
    required this.priceChild,
    required this.priceBaby,
    required this.discount,
    required this.depart,
    required this.rating,
    required this.numberOfRating,
    required this.adults,
    required this.children,
    required this.baby,
    required this.quantityCustomerBooking,
    required this.thumbnail,
    required this.bookedStatus,
    required this.activeStatus,
    required this.createdAt,
    required this.updatedAt,
    required this.tourTimes,
    required this.tourLocations,
  });

  factory Tour.fromJson(Map<String, dynamic> json) {
    // Phân tích cú pháp danh sách tourTimes và tourLocations
    List<TourTime> tourTimes = (json['tourTimes'] as List<dynamic>?)
            ?.map((e) => TourTime.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    List<TourLocation> tourLocations = (json['tourLocations'] as List<dynamic>?)
            ?.map((e) => TourLocation.fromJson(e as Map<String, dynamic>))
            .toList() ??
        [];

    return Tour(
      id: json['id'] ?? 0,
      code: json['code'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      detail: json['detail'] ?? '',
      priceAdult: (json['priceAdult'] as num).toDouble(),
      priceChild: (json['priceChild'] as num).toDouble(),
      priceBaby: (json['priceBaby'] as num).toDouble(),
      discount: (json['discount'] as num).toDouble(),
      depart: json['depart'] ?? '',
      rating: (json['rating'] as num).toDouble(),
      numberOfRating: json['numberOfRating'] ?? 0,
      adults: json['adults'] ?? 0,
      children: json['children'] ?? 0,
      baby: json['baby'] ?? 0,
      quantityCustomerBooking: json['quantityCustomerBooking'] ?? 0,
      thumbnail: json['thumbnail'] ?? 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fflutter.dev%2Fbrand&psig=AOvVaw350GF0TU3MzZjEIG4v87zJ&ust=1722247178477000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPintuu8yYcDFQAAAAAdAAAAABAE',
      bookedStatus: json['bookedStatus'] ?? '',
      activeStatus: json['activeStatus'] ?? '',
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      tourTimes: tourTimes,
      tourLocations: tourLocations,
    );
  }
}

class TourTime {
  final int id;
  final String startDate;
  final String endDate;

  TourTime({
    required this.id,
    required this.startDate,
    required this.endDate,
  });

  factory TourTime.fromJson(Map<String, dynamic> json) {
    return TourTime(
      id: json['id'] ?? 0,
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
    );
  }
}

class TourLocation {
  final int id;
  final String startPoint;
  final String endPoint;

  TourLocation({
    required this.id,
    required this.startPoint,
    required this.endPoint,
  });

  factory TourLocation.fromJson(Map<String, dynamic> json) {
    return TourLocation(
      id: json['id'] ?? 0,
      startPoint: json['startPoint'] ?? '',
      endPoint: json['endPoint'] ?? '',
    );
  }
}
