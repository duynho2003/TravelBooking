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
}) {
  const styleText = {
    fontSize: size,
    fontWeight: weight,
    color: color,
    cursor: link || isButton ? "pointer" : "auto",
    fontFamily: "Montserrat, sans-serif !important",
    textTransform: isUppercase ? "uppercase" : "none",
  };

  const styleLink = {
    color: color,
  };

  return (
    <Text style={styleText}>
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
