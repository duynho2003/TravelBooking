export function generateTourCode() {
  // Lấy thời gian hiện tại
  const currentDate = new Date();

  // Lấy các thành phần của ngày và giờ
  const year = currentDate.getFullYear().toString().slice(-2); // Lấy 2 chữ số cuối cùng của năm
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Thêm '0' và lấy 2 chữ số cuối cùng của tháng
  const day = ("0" + currentDate.getDate()).slice(-2); // Thêm '0' và lấy 2 chữ số cuối cùng của ngày
  const hours = ("0" + currentDate.getHours()).slice(-2); // Thêm '0' và lấy 2 chữ số cuối cùng của giờ
  const minutes = ("0" + currentDate.getMinutes()).slice(-2); // Thêm '0' và lấy 2 chữ số cuối cùng của phút
  const seconds = ("0" + currentDate.getSeconds()).slice(-2); // Thêm '0' và lấy 2 chữ số cuối cùng của giây

  // Sinh chuỗi ngẫu nhiên gồm 8 ký tự in hoa
  const randomChars = Array.from({ length: 8 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  // Kết hợp các thành phần để tạo mã code tour
  const tourCode = `${randomChars}${year}${month}${day}${hours}${minutes}${seconds}`;

  return tourCode;
}
