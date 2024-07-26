package com.example.city_tours.service;

import com.example.city_tours.entity.RoomBooking;
import com.example.city_tours.entity.TourBooking;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.UnsupportedEncodingException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;
import java.util.Properties;

@Service
public class EmailService {

    private static final String SMTP_HOST = "smtp.gmail.com";
    private static final String SMTP_PORT = "587";
    private static final String SMTP_USER = "quangminh456456@gmail.com";
    private static final String SMTP_PASSWORD = "dcihithtorqijeul";

    public static void sendBookingDetailsEmail(String recipientEmail, Object booking) {
        // Cấu hình email
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        // Tạo session với thông tin xác thực
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASSWORD);
            }
        });

        try {
            // Tạo nội dung email
            String subject = "Chi tiết hóa đơn";
            String body = createEmailBody(booking);

            // Tạo đối tượng email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("city_tours@gmail.com", "City Tours"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");

            // Gửi email
            Transport.send(message);
            System.out.println("Email đã được gửi thành công!");

        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    private static String createEmailBody(Object booking) {
        StringBuilder body = new StringBuilder();

        String tableStyle = "border: 1px solid #dddddd; border-collapse: collapse; width: 100%;";
        String thTdStyle = "border: 1px solid #dddddd; padding: 8px;";
        String headerStyle = "background-color: #008489; color: #ffffff;";
        String bodyStyle = "font-family: Arial, sans-serif; color: #333; padding: 20px;";

        if (booking instanceof RoomBooking) {
            RoomBooking roomBooking = (RoomBooking) booking;
            body.append("<html>")
                    .append("<body style='").append(bodyStyle).append("'>")
                    .append("<div style='background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 600px; margin: auto;'>")
                    .append("<div style='background-color: #008489; color: #ffffff; padding: 20px; text-align: center;'>")
                    .append("<h2>City Tours</h2>")
                    .append("</div>")
                    .append("<div style='padding: 20px;'>")
                    .append("<h3 style='color: #333;'>Chi tiết đặt phòng:</h3>")
                    .append("<table style='").append(tableStyle).append("'>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>ID</th>")
                    .append("<td>").append(roomBooking.getId()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Loại phòng</th>")
                    .append("<td>").append(roomBooking.getRoomType()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Số phòng</th>")
                    .append("<td>").append(roomBooking.getRoomNumber()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Ngày đặt</th>")
                    .append("<td>").append(formatDate(roomBooking.getCreatedAt())).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Ngày nhận phòng</th>")
                    .append("<td>").append((roomBooking.getStartDate())).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Ngày trả phòng</th>")
                    .append("<td>").append((roomBooking.getEndDate())).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Giá</th>")
                    .append("<td>").append(formatCurrency(roomBooking.getPrice())).append("</td>")
                    .append("</tr>")
                    .append("</table>")
                    .append("</div>")
                    .append("</div>")
                    .append("</body>")
                    .append("</html>");
        } else if (booking instanceof TourBooking) {
            TourBooking tourBooking = (TourBooking) booking;
            body.append("<html>")
                    .append("<body style='").append(bodyStyle).append("'>")
                    .append("<div style='background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 600px; margin: auto;'>")
                    .append("<div style='background-color: #008489; color: #ffffff; padding: 20px; text-align: center;'>")
                    .append("<h2>City Tours</h2>")
                    .append("</div>")
                    .append("<div style='padding: 20px;'>")
                    .append("<h3 style='color: #333;'>Chi tiết đặt tour:</h3>")
                    .append("<table style='").append(tableStyle).append("'>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>ID</th>")
                    .append("<td>").append(tourBooking.getId()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Mã code</th>")
                    .append("<td>").append(tourBooking.getTour().getCode()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Tour</th>")
                    .append("<td>").append(tourBooking.getTour().getName()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Ngày bắt đầu</th>")
                    .append("<td>").append((tourBooking.getStartTime())).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Số lượng người lớn</th>")
                    .append("<td>").append(tourBooking.getAdults()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Số lượng trẻ em</th>")
                    .append("<td>").append(tourBooking.getChildren()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Số lượng em bé</th>")
                    .append("<td>").append(tourBooking.getBaby()).append("</td>")
                    .append("</tr>")
                    .append("<tr>")
                    .append("<th style='").append(headerStyle).append("'>Giá</th>")
                    .append("<td>").append(formatCurrency(tourBooking.getAmount())).append("</td>")
                    .append("</tr>")
                    .append("</table>")
                    .append("</div>")
                    .append("</div>")
                    .append("</body>")
                    .append("</html>");
        }

        return body.toString();
    }


    public static void sendConfirmationEmail(String email, String token) {
        // Cấu hình email
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        // Tạo session với thông tin xác thực
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASSWORD);
            }
        });

        try {
            // Tạo nội dung email
            String subject = "Xác nhận tài khoản của bạn";
            String confirmationUrl = "http://localhost:4200/confirm-account/token=" + token;
            String body = "<html>"
                    + "<body>"
                    + "<div style='font-family: Arial, sans-serif; padding: 20px;'>"
                    + "<h2>Xác nhận tài khoản của bạn</h2>"
                    + "<p>Chào bạn,</p>"
                    + "<p>Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>"
                    + "<a href='" + confirmationUrl + "' style='display: inline-block; padding: 10px 20px; color: #ffffff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;'>Xác nhận tài khoản</a>"
                    + "<p>Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.</p>"
                    + "<p>Trân trọng,<br/>City Tours</p>"
                    + "</div>"
                    + "</body>"
                    + "</html>";

            // Tạo đối tượng email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("city_tours@gmail.com", "City Tours"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");

            // Gửi email
            Transport.send(message);
            System.out.println("Email đã được gửi thành công!");

        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }

    // EmailService
    public void sendPasswordResetEmail(String email, String resetUrl) {
        // Cấu hình email
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        // Tạo session với thông tin xác thực
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASSWORD);
            }
        });

        try {
            // Tạo nội dung email
            String subject = "Reset Your Password";
            String body = "<html>"
                    + "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif;'>"
                    + "<table align='center' width='100%' cellpadding='0' cellspacing='0' style='max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);'>"
                    + "<tr>"
                    + "<td style='background-color: #008489; color: #ffffff; padding: 20px; text-align: center;'>"
                    + "<h2>City Tours</h2>"
                    + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style='padding: 20px;'>"
                    + "<h3 style='color: #333;'>Reset Your Password</h3>"
                    + "<p style='color: #555;'>Hello,</p>"
                    + "<p style='color: #555;'>We received a request to reset your password. Please click the button below to reset it.</p>"
                    + "<p style='text-align: center;'>"
                    + "<a href='" + resetUrl + "' style='display: inline-block; padding: 15px 25px; color: #ffffff; background-color: #008489; text-decoration: none; border-radius: 5px;'>Reset Password</a>"
                    + "</p>"
                    + "<p style='color: #555;'>If you did not request a password reset, please ignore this email.</p>"
                    + "<p style='color: #555;'>Best regards,<br/>City Tours Team</p>"
                    + "</td>"
                    + "</tr>"
//                    + "<tr>"
//                    + "<td style='background-color: #f9f9f9; color: #555; padding: 10px; text-align: center;'>"
//                    + "<p style='margin: 0;'>City Tours, 1234 Tour Street, Cityville</p>"
//                    + "</td>"
//                    + "</tr>"
                    + "</table>"
                    + "</body>"
                    + "</html>";

            // Tạo đối tượng email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("city_tours@gmail.com", "City Tours"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject(subject);
            message.setContent(body, "text/html; charset=utf-8");

            // Gửi email
            Transport.send(message);
            System.out.println("Email đã được gửi thành công!");

        } catch (MessagingException | UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }


    private static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss dd-MM-yyyy");
        return dateTime.format(formatter);
    }

    private static String formatCurrency(double amount) {
        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return currencyFormatter.format(amount);
    }

}
