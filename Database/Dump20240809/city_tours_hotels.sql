CREATE DATABASE  IF NOT EXISTS `city_tours` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `city_tours`;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (0,5,'2024-08-05 14:41:26.528071',1,1,'2024-08-05 14:48:42.265547','133 Đ. Nguyễn Huệ, Bến Nghé, Quận 1, Hồ Chí Minh 700000','Situated in Ho Chi Minh City, 700 metres from Tan Dinh Market, La Vela Saigon Hotel features accommodation with an outdoor swimming pool, free private parking, a fitness centre and a shared lounge','la velaSaigon'),(0,5,'2024-08-05 14:52:44.849430',2,1,'2024-08-05 14:52:44.849430','34b thu khoa huan quan 1 ho chi minh','Situated conveniently in Ho Chi Minh City, RosaMAY Hotel Thủ Khoa Huân provides 3-star accommodation close to Ben Thanh Street Food Market and Ho Chi Minh City Museum. The property is around 700 metres from Ho Chi Minh City Hall, 600 metres from Reunification Palace and less than 1 km from Union Square Saigon Shopping Mall. The accommodation offers a 24-hour front desk, airport transfers, room service and free WiFi throughout the property.','Rosa May City'),(0,4,'2024-08-05 18:24:49.503789',3,10,'2024-08-05 18:24:49.503789','29 Thủ Khoa Huân, Phường Bến Thành, Quận 1, Hồ Chí Minh 700000','The One Premium Hotel','The One Premium Hotel');
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

-- Dump completed on 2024-08-09 10:56:09
