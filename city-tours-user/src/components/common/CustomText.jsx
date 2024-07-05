import { Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

export default function CustomText({
  size,
  weight,
  color,
  link,
  isButton,
  isUppercase,
  children,
  isItalic,
  isStrikethrough,
  onClick,
}) {
  const styleText = {
    fontSize: size,
    fontWeight: weight,
    color: color,
    cursor: link || isButton || onClick ? "pointer" : "auto",
    fontFamily: "Montserrat, sans-serif !important",
    textTransform: isUppercase ? "uppercase" : "none",
    fontStyle: isItalic ? "italic" : "none",
    textDecoration: isStrikethrough ? "line-through" : "none",
  };

  const styleLink = {
    color: color,
  };

  return (
    <Text style={styleText} onClick={onClick}>
      {link ? (
        <Link to={link} style={styleLink}>
          {children}
        </Link>
      ) : (
        children
      )}
    </Text>
  );
}
