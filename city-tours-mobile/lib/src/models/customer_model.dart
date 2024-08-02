class CustomerModel {
  final int id;
  final int userId;
  final String name;
  final String phone;
  final String address;

  CustomerModel({
    required this.id,
    required this.userId,
    required this.name,
    required this.phone,
    required this.address,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) {
    return CustomerModel(
      id: json['id'],
      userId: json['userId'],
      name: json['name'],
      phone: json['phone'],
      address: json['address'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'phone': phone,
      'address': address,
    };
  }
}
