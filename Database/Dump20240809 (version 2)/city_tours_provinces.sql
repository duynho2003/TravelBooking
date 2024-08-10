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
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity_hotel` bigint NOT NULL,
  `region_id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `FKr52p9hvmia0r4042b4s4h6qil` (`region_id`),
  CONSTRAINT `FKr52p9hvmia0r4042b4s4h6qil` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,2,1,'Hồ Chí Minh','123.jpg'),(2,0,1,'Bình Phước','123.jpg'),(3,0,2,'Hà Nội','123.jpg'),(4,0,2,'Hải Phòng','123.jpg'),(7,0,1,'Hậu Giang','123.jpg'),(8,0,1,'Kiên Giang','123.jpg'),(9,0,1,'Tiền Giang','123.jpg'),(10,1,1,'Vũng Tàu','123.jpg'),(11,0,1,'Sóc Trăng','123.jpg'),(12,0,1,'Đồng Tháp','123.jpg'),(13,0,1,'Bình Dương','123.jpg'),(14,0,1,'Bến Tre','123.jpg'),(15,0,1,'An Giang','123.jpg'),(16,0,1,'Tây Ninh','123.jpg'),(17,0,1,'Long An','123.jpg'),(18,0,1,'Cà Mau','123.jpg'),(19,0,1,'Bạc Liêu','123.jpg'),(22,0,3,'Quảng Bình','123.jpg'),(23,0,3,'Đắk Nông','123.jpg'),(24,0,3,'Khánh Hòa','123.jpg'),(25,0,3,'Quảng Ngãi','123.jpg'),(26,0,3,'Hà Tĩnh','123.jpg'),(27,0,3,'Nghệ An','123.jpg'),(28,0,3,'Gia Lai','123.jpg'),(29,0,3,'Lâm Đồng','123.jpg'),(30,0,3,'Thanh Hóa','123.jpg'),(31,0,3,'Bình Định','123.jpg'),(32,0,3,'Kon Tum','123.jpg'),(33,0,3,'Đắk Lắk','123.jpg'),(34,0,3,'Quảng Nam','123.jpg'),(35,1,3,'Đà Nẵng','123.jpg'),(36,0,3,'Quảng Trị','123.jpg'),(37,0,2,'Vĩnh Phúc','123.jpg'),(38,0,2,'Bắc Kạn','123.jpg'),(39,0,2,'Bắc Giang','123.jpg'),(40,0,2,'Bắc Ninh','123.jpg'),(41,0,2,'Nam Định','123.jpg'),(42,0,2,'Hưng Yên','123.jpg'),(43,0,2,'Hà Nam','123.jpg'),(44,0,2,'Ninh Bình','123.jpg'),(45,0,2,'Hải Dương','123.jpg'),(46,0,2,'Thái Bình','123.jpg'),(48,0,2,'Hà Giang','123.jpg'),(49,0,2,'Tuyên Quang','123.jpg'),(50,0,2,'Phú Thọ','123.jpg'),(51,0,2,'Quảng Ninh','123.jpg'),(53,0,3,'Thừa Thiên - Huế','123.jpg'),(54,0,1,'Đồng Nai','123.jpg'),(55,0,2,'Cao Bằng','123.jpg');
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 21:42:44
