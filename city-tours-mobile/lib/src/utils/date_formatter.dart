import 'package:intl/intl.dart';

String formatDate(DateTime dateTime) {
  final DateFormat formatter = DateFormat('HH:mm:ss dd/MM/yyyy');
  return formatter.format(dateTime);
}
