import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/models/blog_model.dart';
import 'package:flutter_application_1/src/services/blog_api.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/ui/widgets/main_layout.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:flutter_application_1/src/utils/date_formatter.dart';
import 'package:provider/provider.dart';
import 'package:flutter_application_1/src/ui/widgets/custom_button.dart';

class BlogList extends StatefulWidget {
  const BlogList({super.key});

  @override
  State<BlogList> createState() => _BlogListState();
}

class _BlogListState extends State<BlogList> {
  int _selectedIndex = 3;
  bool _hasMoreBlogs = true;
  int _currentPage = 1;
  final int _pageSize = 5;
  final List<Blog> _blogs = [];
  late Future<void> _blogsFuture;
  final BlogApi _blogApi = BlogApi();

  @override
  void initState() {
    super.initState();
    _blogsFuture = _fetchBlogs();
  }

  Future<void> _fetchBlogs() async {
    try {
      List<Blog> blogs = await _blogApi.fetchBlogs(
        page: _currentPage,
        limit: _pageSize,
      );
      setState(() {
        if (blogs.isEmpty) {
          _hasMoreBlogs = false;
        } else {
          _blogs.addAll(blogs);
          _currentPage++;
        }
      });
    } catch (e) {
      print('Error fetching blogs: $e');
      setState(() {
        _hasMoreBlogs = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(),
      endDrawer: const CustomDrawer(),
      body: SingleChildScrollView(
        child: Container(
          width: double.infinity,
          color: AppColors.white,
          child: Column(
            children: [
              _buildTitleSection(),
              _buildBlogsListSection(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: CustomBottomNavigationBar(
        selectedIndex: _selectedIndex,
        onItemTapped: _onItemTapped,
      ),
    );
  }

  Widget _buildTitleSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border(
          bottom: BorderSide(
            color: AppColors.border,
            width: 1.0,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Blogs List',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.grayText,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBlogsListSection() {
    if (_blogs.isEmpty) {
      return Center(
        child: Text(
          'No blogs found',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.grayText,
          ),
        ),
      );
    }

    return SizedBox(
      height: MediaQuery.of(context).size.height,
      child: ListView.builder(
        padding: const EdgeInsets.all(10),
        itemCount: _blogs.length + (_hasMoreBlogs ? 1 : 0),
        itemBuilder: (BuildContext context, int index) {
          if (index == _blogs.length) {
            return _hasMoreBlogs ? _buildLoadMoreButton() : SizedBox.shrink();
          }

          Blog blog = _blogs[index];
          return GestureDetector(
            onTap: () {
              Navigator.pushNamed(
                context,
                '/blog_detail',
                arguments: blog.id,
              );
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 10),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: AppColors.border,
                  width: 1.0,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    spreadRadius: 1,
                    blurRadius: 5,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20.0),
                      bottomLeft: Radius.circular(20.0),
                    ),
                    child: Image.network(
                      blog.thumbnail,
                      width: 140,
                      height: 140,
                      fit: BoxFit.cover,
                    ),
                  ),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            blog.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.grayText,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            "Hash tags: ${blog.hashTags}",
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.grayDark,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            "Description: ${blog.description}",
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.grayDark,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            "Posted on: ${formatDate(blog.createdAt)}",
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppColors.grayDark,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadMoreButton() {
    return Center(
      child: CustomButton(
        backgroundColor: AppColors.greenDark,
        textColor: AppColors.white,
        text: 'See more',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        onPressed: () {
          if (_hasMoreBlogs) {
            _fetchBlogs();
          }
        },
      ),
    );
  }

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
}
