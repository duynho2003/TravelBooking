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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'2024-08-04 14:22:30.715785',1,'2024-08-05 17:01:25.739519','admin@gmail.com','$2a$10$yN.W.mdtQD0H056gjRQCMemeVPOql/GRD0NoALUg3wdVvL3TF8JFi','admin'),(0,'2024-08-04 14:22:30.715785',2,'2024-08-05 17:01:25.739519','staff@gmail.com','$2a$10$xvIjtE045urXTpVFVnxqOOeUNTLBLsUnVPVjjzvlA5NNbi0rYWili','staff'),(1,'2024-08-05 14:22:30.715785',3,'2024-08-08 19:48:28.252288','khenchaynguyen@gmail.com','$2a$10$9fHHQdkehUAUv/E5qKUPc.s6ERJ1J5BH6Hp/4oBy6L1MqtsZOFZ.G','anhduy2003'),(1,'2024-08-05 17:01:25.739519',4,'2024-08-09 21:57:09.370793','tuyetmaivt172@gmail.com','$2a$10$le/C06vXXsJ/T3pTTyjgAemN.hfgGJesev7eZ4qTm3vYuEOVTEXIy','tuyetmai'),(0,'2024-08-05 17:02:57.540026',5,'2024-08-09 17:27:57.518040','duy.2003@yahoo.com.vn','$2a$10$SxDbmlqDIPGVGB/ra/xGWe4Iqq/AHzJl7ekcVfgYcx1JO4iSHVZx6','duy2003yahoo'),(0,'2024-08-07 14:49:16.752736',6,'2024-08-09 15:02:51.567039','staff123456@gmail.com','$2a$10$S/OzpZ2T1UQvPzDlZ5GOLOaWRgt4eYSmNI0TlAa/B0hp21YRhNHi6','staff123456'),(0,'2024-08-09 14:28:08.017817',7,'2024-08-09 14:28:08.017817','maistaff@gmail.com','$2a$10$wRVflEqLhtZgvBxzb6pX.eIniJUzD9EKjApB88c5ZjACm62ir6482','tuyetmaistaff'),(0,'2024-08-09 21:54:56.015662',8,'2024-08-09 21:54:56.015662','nastaff@gmail.com','$2a$10$60tBgc035qtk.KeTLJdHzOo.ZiG.haRg8Y37nATKfifVYI8F8cz2O','anhthu.ng99'),(0,'2024-08-09 21:55:46.649883',9,'2024-08-09 21:55:46.649883','mistaff@gmail.com','$2a$10$/U8rOC3oGKjAMdmcClkrm.2u34DDz7AKhxvX2/pQeM9wujKu8iHLu','mistaff'),(0,'2024-08-09 21:57:53.263889',10,'2024-08-09 22:23:23.263889','minastaff@yahoo.com','$2a$10$raSn64vpwQ8tN1ZV.urFvurL8lCXQ0xHSzxJHeyLh/lN5R9pchBQa','trang.chung74'),(0,'2024-08-09 21:57:53.263889',11,'2024-08-09 22:24:13.563812','tommystaff@yahoo.com','$2a$10$ht/BEFk0nw051L0W67.nTeISy4NpTd/Da2wdmEYhYdXCIlk16uwQC','tommystaff'),(0,'2024-08-09 21:57:53.263889',12,'2024-08-09 22:25:15.243645','david@yahoo.com','$2a$10$8Vvl06EbbZ1nnes4VezYwOHM5ChUPLj1dvZgbAgmbfionHaH9olHu','david'),(0,'2024-08-09 21:57:53.263889',13,'2024-08-09 22:26:13.253832','alex@yahoo.com','$2a$10$Ug00W7geZtSM3ao84Rq03OhGhbpGC/12mrMWa4V7OVPZSKQgvKkIW','alex'),(0,'2024-08-09 21:57:53.263889',14,'2024-08-09 22:27:43.453854','sury@yahoo.com','$2a$10$0LjJ0GlOGHmxlf9Al4FXZ.tFTHkjkhWWRKva8zGK3RXLuIGV2qII6','sury'),(0,'2024-08-09 21:57:53.263889',15,'2024-08-09 22:28:43.424823','sumi@yahoo.com','$2a$10$Qh16OhBwf17pH.ovtOlkbuS7eE8okK33D9lrLdx7neCI07g6MOhiO','sumi'),(0,'2024-08-09 21:57:53.263889',16,'2024-08-09 22:29:33.543812','xiumai@yahoo.com','$2a$10$uVPM.vm0FBmIBVW0VyK.aeWmwe08SBQI55o7fY2pTFKOyutEWpo8a','xiumai'),(0,'2024-08-09 21:57:53.263889',17,'2024-08-09 22:30:33.563814','daniel@gmail.com','$2a$10$C20BeCZHvtWdZuFZXRYNp.C/ZbMMVzZ5O3aITZ0yZKlmX2eNmWk8.','daniel'),(0,'2024-08-09 21:57:53.263889',18,'2024-08-09 22:31:23.123834','citytoursadmin@gmail.com','$2a$10$HwNwXsmmfkicLrCSJcW6geVkm2ESHMLBkRdHBPbNxOap774gnaho6','citytouradmin'),(0,'2024-08-09 21:57:53.263889',19,'2024-08-09 22:32:33.113845','thaochung@yahoo.com','$2a$10$Aql5IaGVobS4p.BPaGNiN.W1sWnGQvi8SjOi0CQ45dba/CXEQC9Oa','thaochung'),(1,'2024-08-09 21:57:53.263889',20,'2024-08-09 22:33:43.103823','rileyle@yahoo.com','$2a$10$dHOPgzU00kZi1VNoEM6tyOy7I2SFmz.uaYA/jEWRbTj.tOl71D7yK','rileyle'),(1,'2024-08-09 21:57:53.263889',21,'2024-08-09 22:34:33.153854','lynnle@yahoo.com','$2a$10$UhucmH4Wb2fH2WgnNlhaeee3oCXmfIZrLhwiaM/pBopaf3B4nGsau','lynnle'),(0,'2024-08-09 21:57:53.263889',22,'2024-08-09 22:35:33.163823','lanchung@yahoo.com','$2a$10$36FaBDaStww/PwoAnXzsqu9HCCMZKrLjVrCf7e0VdEdFvmfteULGC','lanchung');
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

-- Dump completed on 2024-08-10  2:47:06
