import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/blog_model.dart';
import 'package:flutter_application_1/src/services/blog_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class BlogDetail extends StatefulWidget {
  final int blogId;

  const BlogDetail({super.key, required this.blogId});

  @override
  State<BlogDetail> createState() => _BlogDetailState();
}

class _BlogDetailState extends State<BlogDetail> {
  late Future<Blog> _blogFuture;
  final BlogApi _blogApi = BlogApi();
  bool _showFullDetail = false;
  int _selectedIndex = 3;

  void _onItemTapped(int index) {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    setState(() {
      _selectedIndex = index;
    });

    switch (index) {
      case 0:
        Navigator.pushNamed(context, '/hotels_list');
        break;
      case 1:
        Navigator.pushNamed(context, '/tours_list');
        break;
      case 2:
        Navigator.pushNamed(context, '/');
        break;
      case 3:
        Navigator.pushNamed(context, '/blogs_list');
        break;
      case 4:
        if (authProvider.isAuthenticated) {
          Navigator.pushNamed(context, '/profile');
        } else {
          Navigator.pushNamed(context, '/login');
        }
        break;
    }
  }

  String _truncateHtml(String html, {int maxLength = 200}) {
    if (html.length > maxLength) {
      return '${html.substring(0, maxLength)}...';
    } else {
      return html;
    }
  }

  @override
  void initState() {
    super.initState();
    _blogFuture = _blogApi.getBlogById(blogId: widget.blogId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: FutureBuilder<Blog>(
        future: _blogFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData) {
            return const Center(child: Text('No blog data available'));
          } else {
            final blog = snapshot.data!;

            return SingleChildScrollView(
                child: Container(
              color: AppColors.border,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildInfoSection(blog),
                  const SizedBox(height: 10),
                  _buildDetailSection(blog),
                ],
              ),
            ));
          }
        },
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildInfoSection(Blog blog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          color: AppColors.white,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                height: 200,
                child: ClipRRect(
                  child: Image.network(
                    blog.thumbnail,
                    fit: BoxFit.cover,
                    width: double.infinity,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      blog.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      "Hash tags: ${blog.hashTags}",
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: AppColors.grayText,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      "Description: ${blog.description}",
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: AppColors.grayText,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailSection(Blog blog) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          color: AppColors.white,
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Content",
                style: TextStyle(
                  fontSize: 14,
                  color: AppColors.grayDark,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 10),
              Container(
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Html(
                  data: _showFullDetail
                      ? blog.content
                      : _truncateHtml(blog.content),
                  style: {
                    "body": Style(
                      fontSize: FontSize(14.0),
                      color: AppColors.grayText,
                    ),
                    "h1": Style(
                      fontSize: FontSize(22.0),
                      fontWeight: FontWeight.bold,
                    ),
                    "h3": Style(
                      fontSize: FontSize(18.0),
                      fontWeight: FontWeight.bold,
                    ),
                    "p": Style(
                      fontSize: FontSize(14.0),
                    ),
                    "ul": Style(
                      fontSize: FontSize(14.0),
                    ),
                    "li": Style(
                      fontSize: FontSize(14.0),
                    ),
                  },
                ),
              ),
              const SizedBox(height: 10),
              TextButton(
                onPressed: () {
                  setState(() {
                    _showFullDetail = !_showFullDetail;
                  });
                },
                child: Text(
                  _showFullDetail ? 'Hide' : 'Show More',
                  style: const TextStyle(
                    color: AppColors.greenDark,
                    fontSize: 14,
                  ),
                ),
              )
            ],
          ),
        ),
      ],
    );
  }
}
