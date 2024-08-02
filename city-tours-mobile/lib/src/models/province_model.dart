class Province {
  final int id;
  final String name;
  final int quantityHotels;
  final String thumbnailUrlsFirstHotels;

  Province({
    required this.id,
    required this.name,
    required this.quantityHotels,
    required this.thumbnailUrlsFirstHotels,
  });

  factory Province.fromJson(Map<String, dynamic> json) {
    List<dynamic> hotels = json['hotels'];
    String firstHotelThumbnail =
        hotels.isNotEmpty ? hotels[0]['thumbnailUrls'][0] : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fflutter.dev%2Fbrand&psig=AOvVaw350GF0TU3MzZjEIG4v87zJ&ust=1722247178477000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPintuu8yYcDFQAAAAAdAAAAABAE';

    return Province(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      quantityHotels: json['quantityHotels'] ?? '',
      thumbnailUrlsFirstHotels: firstHotelThumbnail,
    );
  }
}
