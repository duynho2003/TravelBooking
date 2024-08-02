import 'dart:convert';
import 'package:flutter_application_1/src/models/blog_model.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_application_1/src/utils/constants.dart';

class BlogApi {
  Future<List<Blog>> fetchBlogs({
    int page = 1,
    int limit = 4,
  }) async {
    final url =
        Uri.parse('${URI.GET_ALL_BLOGS_MOBILE}?page=$page&limit=$limit');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final List<dynamic>? blogData = responseData['data']['data'];

        if (blogData != null) {
          return blogData.map((json) => Blog.fromJson(json)).toList();
        } else {
          throw Exception('No blog data available');
        }
      } else {
        throw Exception('Failed to load blogs');
      }
    } catch (e) {
      throw Exception('Failed to fetch blogs: $e');
    }
  }

  Future<Blog> getBlogById({required int blogId}) async {
    final url = Uri.parse('${URI.GET_BLOG_BY_ID_MOBILE}$blogId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final Map<String, dynamic>? blogData = responseData['data'];

        if (blogData != null) {
          return Blog.fromJson(blogData);
        } else {
          throw Exception('No blog data found');
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        final String errorMessage =
            errorData['message'] ?? 'Failed to load blog';
        throw Exception(errorMessage);
      }
    } catch (e) {
      throw Exception('Failed to fetch blog: $e');
    }
  }
}
