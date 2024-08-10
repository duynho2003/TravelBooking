-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: city_tours
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `active_status` tinyint DEFAULT NULL,
  `rating` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `province_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` longtext,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7tlgqdfyabwp5xmkuay6o9ran` (`province_id`),
  CONSTRAINT `FK7tlgqdfyabwp5xmkuay6o9ran` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`),
  CONSTRAINT `hotels_chk_1` CHECK ((`active_status` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (0,5,'2024-08-05 14:41:26.528071',1,1,'2024-08-05 14:48:42.265547','133 Đ. Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh 700000','Situated in Ho Chi Minh City, 700 metres from Tan Dinh Market, La Vela Saigon Hotel features accommodation with an outdoor swimming pool, free private parking, a fitness centre and a shared lounge','la velaSaigon'),(0,5,'2024-08-05 14:52:44.849430',2,1,'2024-08-05 14:52:44.849430','34b thu khoa huan quan 1 ho chi minh','Situated conveniently in Ho Chi Minh City, RosaMAY Hotel Thủ Khoa Huân provides 3-star accommodation close to Ben Thanh Street Food Market and Ho Chi Minh City Museum. The property is around 700 metres from Ho Chi Minh City Hall, 600 metres from Reunification Palace and less than 1 km from Union Square Saigon Shopping Mall. The accommodation offers a 24-hour front desk, airport transfers, room service and free WiFi throughout the property.','Rosa May City'),(0,4,'2024-08-05 18:24:49.503789',3,10,'2024-08-05 18:24:49.503789','29 Thủ Khoa Huân, Phường Bến Thành, Quận 1, Hồ Chí Minh 700000','The One Premium Hotel','The One Premium Hotel'),(0,4,'2024-08-07 18:05:39.305083',4,35,'2024-08-07 18:05:39.305083','148 Võ Nguyên Giáp, Phước Mỹ, Da Nang','The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Conveniently situated in the Phước Mỹ part of Da Nang, this property puts you close to attractions and interesting dining options. Be sure to set some time aside to visit The Marble Mountains as well as My Khe Beach nearby. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.','Awaken Danang Hotel'),(0,5,'2024-08-07 18:08:45.665212',5,3,'2024-08-07 18:08:45.666140','84 P. Hàng Gai, Old Quarter, Hanoi','Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Old Quarter, allowing you access and proximity to local attractions and sights. Don\'t leave before paying a visit to the famous Old Quarter. Rated with 5 stars, this high-quality property provides guests with access to restaurant, outdoor pool and sauna on-site.','Le Chanvre Hanoi Hotel & Spa'),(0,3,'2024-08-07 18:12:32.268607',6,10,'2024-08-07 18:12:32.268607','117 Thuy Van Thang Tam Ward, Thang Tam, Vung Tau','The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Strategically situated in Thang Tam, allowing you access and proximity to local attractions and sights. Be sure to set some time aside to visit Vung Tau Light House as well as Front Beach nearby. Rated with 3 stars, this high-quality property provides guests with access to restaurant, fitness center and outdoor pool on-site.','ibis Styles Vung Tau'),(0,5,'2024-08-07 18:17:34.248330',7,31,'2024-08-07 18:17:34.248330','28 Nguyễn Huệ, Tòa Nhà TMS , City Beach, Quy Nhon (Binh Dinh)','Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in City Beach, allowing you access and proximity to local attractions and sights. Don\'t leave before paying a visit to the famous Phu Cat Airport. This 5-star property features restaurant to make your stay more indulgent and memorable.','TMS Quy Nhơn - ROSHI Apartment Ocean View 5 stars out of 5'),(0,3,'2024-08-07 18:19:59.138469',8,25,'2024-08-07 18:19:59.138469','Số 09 Hòa Bình, Khu Đô Thị - Dịch Vụ VSIP, Phường Trương Quang Trọng, Quang Ngai','Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Conveniently situated in the Quang Ngai part of Quang Ngai, this property puts you close to attractions and interesting dining options. This 3-star property is packed with in-house facilities to improve the quality and joy of your stay.','NEWCC HOTEL AND SERVICED APARTMENT'),(0,4,'2024-08-07 18:23:23.230685',9,4,'2024-08-07 18:23:23.231676','64 Dien Bien Phu, City Center / Sat Market, Haiphong','Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in City Center / Sat Market, allowing you access and proximity to local attractions and sights. Don\'t leave before paying a visit to the famous Cat Bi International Airport. Rated with 4 stars, this high-quality property provides guests with access to restaurant, hot tub and outdoor pool on-site.','Manoir Des Arts Hotel'),(0,4,'2024-08-07 18:29:13.529506',10,4,'2024-08-07 18:29:13.529506','No.1 Road 1- Waterfront City, Vinh Niem Ward, Le Chan District, Rao Bridge, Haiphong','The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Conveniently situated in the Rao Bridge part of Haiphong, this property puts you close to attractions and interesting dining options. Don\'t leave before paying a visit to the famous Cat Bi International Airport. Rated with 5 stars, this high-quality property provides guests with access to restaurant, fitness center and spa on-site.','Hotel Nikko Hai Phong'),(0,5,'2024-08-07 18:31:39.512230',11,4,'2024-08-07 18:31:39.512230','Tower A, TD Plaza, Lot 20A, Le Hong Phong Street, Dang Giang Ward, Ngo Quyen District, City Center / Sat Market, Haiphong,','In addition to the standard of Ascott Cares, all guests get free Wi-Fi in all rooms and free parking if arriving by car. Conveniently situated in the City Center / Sat Market part of Haiphong, this property puts you close to attractions and interesting dining options. Don\'t leave before paying a visit to the famous Cat Bi International Airport. Rated with 5 stars, this high-quality property provides guests with access to restaurant, fitness center and steamroom on-site.','Somerset Central TD Haiphong '),(0,4,'2024-08-07 18:34:30.053552',12,3,'2024-08-07 18:34:30.053552','14 Ly Nam De Street, Hang Ma, Hoan Kiem District, Ha Noi, Old Quarter, Hanoi',' Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Old Quarter, allowing you access and proximity to local attractions and sights. Don\'t leave before paying a visit to the famous Old Quarter. This 4-star property features restaurant to make your stay more indulgent and memorable.','Rey Hotel Hanoi '),(0,5,'2024-08-07 18:36:20.738541',13,10,'2024-08-07 18:36:20.738541','179 Thuy Van, Ward 8, Phường 8, Vung Tau','The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Conveniently situated in the Phường 8 part of Vung Tau, this property puts you close to attractions and interesting dining options. Don\'t leave before paying a visit to the famous Vung Tau Light House. Rated with 5 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.','Vias Hotel Vung Tau - Inclusive Transportation'),(0,4,'2024-08-07 18:38:20.958231',14,10,'2024-08-07 18:38:20.958231','02 Truong Cong Dinh, Phường 2, Vung Tau','The car parking and the Wi-Fi are always free, so you can stay in touch and come and go as you please. Strategically situated in Phường 2, allowing you access and proximity to local attractions and sights. Be sure to set some time aside to visit Vung Tau Light House as well as Front Beach nearby. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.','Fusion Suites Vung Tau'),(0,3,'2024-08-07 18:41:13.394407',15,10,'2024-08-07 18:41:13.394407','12 Trương Công Định, Phường 2, Vũng Tàu , Phường 2, Vung Tau','Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Phường 2, allowing you access and proximity to local attractions and sights. Be sure to set some time aside to visit Vung Tau Light House as well as Front Beach nearby. Rated with 3 stars, this high-quality property provides guests with access to restaurant, indoor pool and outdoor pool on-site.','Hôtel D\'Melin '),(0,4,'2024-08-09 15:26:01.940558',16,35,'2024-08-09 15:26:01.940558','52-54 Trần Thanh Mại, An Hải, Sơn Trà, Đà Nẵng 550000','Sea Hotel & Apartment','Sea Hotel & Apartment');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 21:42:45
