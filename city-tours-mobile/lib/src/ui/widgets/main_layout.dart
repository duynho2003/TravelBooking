import 'package:flutter/material.dart';
import 'package:flutter_application_1/src/state/auth_provider.dart';
import 'package:flutter_application_1/src/utils/constants.dart';
import 'package:provider/provider.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 0,
              blurRadius: 4,
              offset: Offset(0, 4)),
        ],
      ),
      child: AppBar(
        title: Row(
          children: [
            InkWell(
              onTap: () {
                Navigator.pushNamed(context, '/');
              },
              child: Image.asset(
                'assets/images/logo.png',
                height: 30,
                fit: BoxFit.cover,
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.white,
        automaticallyImplyLeading: false,
        elevation: 0,
      ),
    );
  }
}

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          const DrawerHeader(
            decoration: BoxDecoration(
              color: AppColors.greenDark,
            ),
            child: Text(
              'Menu City Tours',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
              ),
            ),
          ),
          if (authProvider.isAuthenticated)
            Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
              child: Text(
                'Xin chào, ${authProvider.username}',
                style: const TextStyle(
                  color: Colors.black,
                  fontSize: 16,
                ),
              ),
            ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/');
            },
          ),
          ListTile(
            leading: const Icon(Icons.hotel),
            title: const Text('Hotels'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/hotels_list');
            },
          ),
          ListTile(
            leading: const Icon(Icons.tour),
            title: const Text('Tours'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/tours_list');
            },
          ),
          ListTile(
            leading: const Icon(Icons.book),
            title: const Text('Blogs'),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.pushNamed(context, '/blogs');
            },
          ),
          if (authProvider.isAuthenticated) ...[
            ExpansionTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              children: <Widget>[
                ListTile(
                  leading: const Icon(Icons.book_online),
                  title: const Text('Tour Bookings'),
                  onTap: () {
                    Navigator.of(context).pop();
                    Navigator.pushNamed(context, '/tour_bookings');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.hotel),
                  title: const Text('Hotel Bookings'),
                  onTap: () {
                    Navigator.of(context).pop();
                    Navigator.pushNamed(context, '/room_bookings');
                  },
                ),
              ],
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {
                Navigator.of(context).pop();
                authProvider.logout();
                Navigator.pushNamed(context, '/');
              },
            ),
          ] else ...[
            ListTile(
              leading: const Icon(Icons.app_registration),
              title: const Text('Register'),
              onTap: () {
                Navigator.of(context).pop();
                Navigator.pushReplacementNamed(context, '/register');
              },
            ),
            ListTile(
              leading: const Icon(Icons.login),
              title: const Text('Login'),
              onTap: () {
                Navigator.of(context).pop();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ],
      ),
    );
  }
}

class CustomBottomNavigationBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemTapped;

  const CustomBottomNavigationBar({
    super.key,
    required this.selectedIndex,
    required this.onItemTapped,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: selectedIndex,
      onTap: onItemTapped,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.hotel),
          label: 'Hotels',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.tour),
          label: 'Tours',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.book),
          label: 'Blogs',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'User',
        ),
      ],
      selectedItemColor: AppColors.greenDark,
      unselectedItemColor: Colors.grey,
    );
  }
}
