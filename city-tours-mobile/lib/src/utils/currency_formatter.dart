import 'package:intl/intl.dart';

String formatCurrency(double amount) {
  final NumberFormat currencyFormatter = NumberFormat.currency(
    locale: 'vi_VN',
    symbol: '₫',
  );
  return currencyFormatter.format(amount);
}
