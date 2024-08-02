class Auth {
  final int id;
  final String username;
  final String email;
  final String password;
  final Set<String> roles;

  Auth({
    required this.id,
    required this.username,
    required this.email,
    required this.password,
    required this.roles,
  });

  factory Auth.fromJson(Map<String, dynamic> json) {
    var rolesFromJson = json['roles'] as List<dynamic>?;

    Set<String> roles = {};
    if (rolesFromJson != null) {
      roles = rolesFromJson.map((role) => role.toString()).toSet();
    }

    return Auth(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      roles: roles,
    );
  }
}
