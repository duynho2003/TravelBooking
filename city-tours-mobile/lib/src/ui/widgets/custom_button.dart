import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final Color backgroundColor;
  final Color hoverColor;
  final double borderRadius;
  final String text;
  final Color textColor;
  final double fontSize;
  final FontWeight fontWeight;
  final String? routeName;
  final VoidCallback? onPressed;
  final Function()? onReviewSelected;
  final double paddingTop;
  final double paddingBottom;
  final Color? borderColor;
  final double? borderWidth;

  const CustomButton({
    super.key,
    required this.backgroundColor,
    required this.textColor,
    required this.text,
    this.hoverColor = Colors.grey,
    this.routeName,
    this.borderRadius = 0,
    this.fontSize = 16,
    this.fontWeight = FontWeight.normal,
    this.onPressed,
    this.onReviewSelected,
    this.paddingTop = 10,
    this.paddingBottom = 10,
    this.borderColor,
    this.borderWidth,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: backgroundColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(borderRadius),
          side: BorderSide(
            color: borderColor ?? Colors.transparent,
            width: borderWidth ?? 0,
          ),
        ),
        padding: EdgeInsets.symmetric(
          horizontal: 20,
          vertical: (paddingTop + paddingBottom) / 2,
        ),
      ),
      onPressed: () {
        if (onReviewSelected != null) {
          onReviewSelected!();
        } else if (onPressed != null) {
          onPressed!();
        } else if (routeName != null) {
          Navigator.pushNamed(context, routeName!);
        }
      },
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
          // fontFamily: "Montserrat",
        ),
      ),
    );
  }
}
