class Blog {
  final int id;
  final String title;
  final String hashTags;
  final String author;
  final String thumbnail;
  final String description;
  final String content;
  final String activeStatus;
  final DateTime createdAt;
  final DateTime updatedAt;

  Blog({
    required this.id,
    required this.title,
    required this.hashTags,
    required this.author,
    required this.thumbnail,
    required this.description,
    required this.content,
    required this.activeStatus,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Blog.fromJson(Map<String, dynamic> json) {
    return Blog(
      id: json['id'],
      title: json['title'],
      hashTags: json['hashTags'],
      author: json['author'],
      thumbnail: json['thumbnail'],
      description: json['description'],
      content: json['content'],
      activeStatus: json['activeStatus'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'hashTags': hashTags,
      'author': author,
      'thumbnail': thumbnail,
      'description': description,
      'content': content,
      'activeStatus': activeStatus,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'Blog{id: $id, title: $title, hashTags: $hashTags, author: $author, thumbnail: $thumbnail, description: $description, content: $content, activeStatus: $activeStatus, createdAt: $createdAt, updatedAt: $updatedAt}';
  }
}
