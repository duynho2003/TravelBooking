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
-- Table structure for table `tour_locations`
--

DROP TABLE IF EXISTS `tour_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_locations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tour_id` bigint NOT NULL,
  `coordinates_end_point` varchar(255) DEFAULT NULL,
  `coordinates_start_point` varchar(255) DEFAULT NULL,
  `end_point` varchar(255) DEFAULT NULL,
  `start_point` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5rii550hmj37axh535de91g4u` (`tour_id`),
  CONSTRAINT `FK5rii550hmj37axh535de91g4u` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_locations`
--

LOCK TABLES `tour_locations` WRITE;
/*!40000 ALTER TABLE `tour_locations` DISABLE KEYS */;
INSERT INTO `tour_locations` VALUES (1,1,'{\"lat\":11.8644829,\"lng\":108.5669851}','{\"lat\":14.058324,\"lng\":108.277199}','BẢO TÀNG TRÀ LONG ĐỈNH ','EURO GARDEN “VƯỜN CHÂU ÂU” '),(2,1,'{\"lat\":11.876642003000029,\"lng\":108.47097440500005}','{\"lat\":10.776553100000058,\"lng\":106.70105355500004}','THÁC PRENN ','TP. HỒ CHÍ MINH '),(3,1,'{\"lat\":10.776553100000058,\"lng\":106.70105355500004}','{\"lat\":11.9404192,\"lng\":108.4583132}','TP. HỒ CHÍ MINH ','ĐÀ LẠT '),(4,2,NULL,NULL,'TP CẦN THƠ','PHAN THIẾT '),(5,2,'{\"lat\":10.922097951000069,\"lng\":108.09935774000007}','{\"lat\":10.036532057000045,\"lng\":105.78778410900009}','PHAN THIẾT','TP. CẦN THƠ'),(6,2,'{\"lat\":11.067778000000033,\"lng\":108.41694400000006}','{\"lat\":10.928611000000046,\"lng\":108.28777800000006}','BÀU TRẮNG','MŨI NÉ'),(8,4,'{\"lat\":16.4637117,\"lng\":107.5908628}','{\"lat\":16.07471103000006,\"lng\":108.22431477800006}','huế ','đà nẵng '),(9,4,'{\"lat\":16.07471103000006,\"lng\":108.22431477800006}','{\"lat\":16.4637117,\"lng\":107.5908628}','đà nẵng','huế '),(10,7,'{\"lat\":10.348519487000033,\"lng\":107.07905049000004}','{\"lat\":10.776553100000058,\"lng\":106.70105355500004}','VŨNG TÀU','TP HCM '),(11,8,'{\"lat\":10.236211766000054,\"lng\":106.37366981700006}','{\"lat\":10.776553100000058,\"lng\":106.70105355500004}','BẾN TRE','TP HCM '),(12,5,'{\"lat\":20.99432770800007,\"lng\":105.94156827600005}','{\"lat\":21.02819540300004,\"lng\":105.85415977800005}','sappa','hà nội');
/*!40000 ALTER TABLE `tour_locations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-07 15:03:00
