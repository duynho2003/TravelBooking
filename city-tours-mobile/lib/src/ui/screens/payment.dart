import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class Payment extends StatefulWidget {
  final String paymentUrl;

  const Payment({super.key, required this.paymentUrl});

  @override
  _PaymentState createState() => _PaymentState();
}

class _PaymentState extends State<Payment> {
  @override
  void initState() {
    super.initState();
    _launchURL();
  }

  Future<void> _launchURL() async {
    final Uri url = Uri.parse(widget.paymentUrl);
    // Kiểm tra xem URL có thể được mở không
    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      // Xử lý lỗi nếu không thể mở URL
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: const Center(
        child: Text('Redirecting to payment...'),
      ),
    );
  }
}
