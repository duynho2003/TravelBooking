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
-- Table structure for table `room_bookings`
--

DROP TABLE IF EXISTS `room_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_bookings` (
  `price` double DEFAULT NULL,
  `review_status` tinyint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `end_date` varchar(255) DEFAULT NULL,
  `hotel_name` varchar(255) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `booking_status` tinyint DEFAULT NULL,
  `payment_status` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj968mr2myellgp8r1rgs1w09i` (`customer_id`),
  KEY `FK8wb395es6guf2c5cq0j6w2i72` (`room_id`),
  CONSTRAINT `FK8wb395es6guf2c5cq0j6w2i72` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FKj968mr2myellgp8r1rgs1w09i` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `room_bookings_chk_1` CHECK ((`review_status` between 0 and 1)),
  CONSTRAINT `room_bookings_chk_2` CHECK ((`booking_status` between 0 and 2)),
  CONSTRAINT `room_bookings_chk_3` CHECK ((`payment_status` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1700000,0,'2024-08-05 16:10:52.087043',1,1,1,'2024-08-05 16:10:52.087043','2024-08-06','la velaSaigon','202','Double Room','2024-08-05',1,1),(3400000,0,'2024-08-05 18:39:50.599739',2,2,1,'2024-08-05 18:39:50.599739','2024-08-08','la velaSaigon','202','Double Room','2024-08-06',1,1),(3400000,1,'2024-08-07 14:18:19.732039',2,3,3,'2024-08-07 14:18:19.732039','2024-08-10','The One Premium Hotel','101','Single Room','2024-08-08',1,1),(2242400,0,'2024-08-09 00:24:17.006392',2,4,2,'2024-08-09 00:24:17.006392','2024-08-10','Rosa May City','102','Single Room','2024-08-09',1,1),(2900002.0000000005,0,'2024-08-09 15:15:21.494517',3,5,8,'2024-08-09 15:15:21.494517','2024-08-12','Awaken Danang Hotel','303','Triple Room','2024-08-11',1,1),(1900000,0,'2024-08-09 15:18:30.943492',6,6,24,'2024-08-09 15:18:30.943492','2024-08-10','Somerset Central TD Haiphong ','101','Single Room','2024-08-09',1,1),(1398000,1,'2024-08-09 15:29:41.428294',2,7,25,'2024-08-09 15:29:41.428294','2024-08-10','Sea Hotel & Apartment','101','Single Room','2024-08-09',1,1),(998000,0,'2024-08-09 15:36:01.925738',2,8,26,'2024-08-09 15:36:01.925738','2024-08-10','Sea Hotel & Apartment','102','Single Room','2024-08-09',1,1);
/*!40000 ALTER TABLE `room_bookings` ENABLE KEYS */;
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
