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
-- Table structure for table `room_views`
--

DROP TABLE IF EXISTS `room_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_views` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `images` longtext,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm9h2o2o7kv6e4r67vgh05ig8d` (`room_id`),
  CONSTRAINT `FKm9h2o2o7kv6e4r67vgh05ig8d` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_views`
--

LOCK TABLES `room_views` WRITE;
/*!40000 ALTER TABLE `room_views` DISABLE KEYS */;
INSERT INTO `room_views` VALUES (1,1,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722843720/iljxar3ygbe3plb5vob2.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722843721/xtni8yuag0qu4kdwasax.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722843720/xspd38etqsveleqwmydi.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722843723/vkfdxz3hsn2jdfc4mj1f.jpg','beach'),(2,2,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844431/ajjvbkjypbvo5bzdgdka.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722844430/sjyi8fs6lffuorgdepip.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722844430/euwh2cektpl9o5x3ktou.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722844430/opnmhiofzpahkuw2jfdm.jpg','trung tam thanh pho'),(3,3,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722857129/gvhbjbfgpgeo1xud3ur5.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722857129/wjtpd1x6nejvpzsl9blb.jpg,https://res.cloudinary.com/dbammk7wt/image/upload/v1722857128/qpt9mefvoyrnab6oru99.jpg','beach');
/*!40000 ALTER TABLE `room_views` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-09 10:56:10
