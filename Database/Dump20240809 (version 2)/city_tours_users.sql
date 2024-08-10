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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `status` tinyint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `users_chk_1` CHECK ((`status` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'2024-08-04 14:22:30.715785',1,'2024-08-05 17:01:25.739519','admin@gmail.com','$2a$10$yN.W.mdtQD0H056gjRQCMemeVPOql/GRD0NoALUg3wdVvL3TF8JFi','admin'),(0,'2024-08-04 14:22:30.715785',2,'2024-08-05 17:01:25.739519','staff@gmail.com','$2a$10$xvIjtE045urXTpVFVnxqOOeUNTLBLsUnVPVjjzvlA5NNbi0rYWili','staff'),(1,'2024-08-05 14:22:30.715785',3,'2024-08-08 19:48:28.252288','khenchaynguyen@gmail.com','$2a$10$9fHHQdkehUAUv/E5qKUPc.s6ERJ1J5BH6Hp/4oBy6L1MqtsZOFZ.G','anhduy2003'),(1,'2024-08-05 17:01:25.739519',4,'2024-08-07 17:01:25.739519','tuyetmaivt172@gmail.com','$2a$10$le/C06vXXsJ/T3pTTyjgAemN.hfgGJesev7eZ4qTm3vYuEOVTEXIy','Tuyet Mai'),(0,'2024-08-05 17:02:57.540026',5,'2024-08-09 17:27:57.518040','duy.2003@yahoo.com.vn','$2a$10$SxDbmlqDIPGVGB/ra/xGWe4Iqq/AHzJl7ekcVfgYcx1JO4iSHVZx6','duy2003yahoo'),(0,'2024-08-07 14:49:16.752736',6,'2024-08-09 15:02:51.567039','staff123456@gmail.com','$2a$10$S/OzpZ2T1UQvPzDlZ5GOLOaWRgt4eYSmNI0TlAa/B0hp21YRhNHi6','staff123456'),(0,'2024-08-09 14:28:08.017817',7,'2024-08-09 14:28:08.017817','maistaff@gmail.com','$2a$10$wRVflEqLhtZgvBxzb6pX.eIniJUzD9EKjApB88c5ZjACm62ir6482','tuyetmaistaff');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
