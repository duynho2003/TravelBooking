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
-- Table structure for table `hotel_images`
--

DROP TABLE IF EXISTS `hotel_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotel_images` (
  `hotel_id` bigint NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrj3n45f8oqy1yr996g14j757i` (`hotel_id`),
  CONSTRAINT `FKrj3n45f8oqy1yr996g14j757i` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_images`
--

LOCK TABLES `hotel_images` WRITE;
/*!40000 ALTER TABLE `hotel_images` DISABLE KEYS */;
INSERT INTO `hotel_images` VALUES (1,10,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844120/yie2eascrea2lmutesac.jpg'),(1,11,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844120/b0r773bsgylspuneawbc.jpg'),(1,12,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844120/j8zhsx2mo1cmspohdrrf.jpg'),(1,13,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844120/ssghf4msor0et3j3rfbi.jpg'),(2,14,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844363/jtoldqu6exza2mibvcal.jpg'),(2,15,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844363/blu8qj3vdpzvtgvxj5xf.jpg'),(2,16,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844363/txakrq83s4mcje1whwtr.jpg'),(2,17,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722844363/uels5t54czomqp4vzf7a.jpg'),(3,18,'https://res.cloudinary.com/dbammk7wt/image/upload/v1722857087/wd90xvsgbrknjuqmolqj.jpg'),(4,19,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028737/y2wprqs7lcmrklj9qjcv.webp'),(4,20,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028737/uyor2xbgex79gdwakmmh.jpg'),(4,21,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028736/tlexfu1doukmpzkjmmd1.webp'),(4,22,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028736/lf0opljpuoeyzkypcfzx.webp'),(5,23,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028923/llgiwivh681k5cspld6z.webp'),(5,24,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028923/wsygpvdx4nkm8wznpge2.jpg'),(5,25,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028923/r9gvcwrrtkz4f2giwkjm.webp'),(5,26,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723028923/cmqefsdwh78leboyryjc.webp'),(6,27,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029149/c8pmktvnnr5clybhqys3.webp'),(6,28,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029149/oimf9e793cj7o3k272yh.webp'),(6,29,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029149/aczvpzd9xazcm6rf3lmu.webp'),(6,30,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029149/ptzei1egvmvabuuxpepq.webp'),(7,31,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029451/vdlplrj1kjhxqr2cspsv.webp'),(7,32,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029451/myzasbvkaunwkggp9za3.webp'),(7,33,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029452/hfrkzgde4aixi10vk8uq.webp'),(7,34,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029451/fhzf0zsmlr02zwnqgeqq.webp'),(8,35,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029596/txskpttnijchwhqmj5hc.webp'),(8,36,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029597/bclh4agqiguyh8ay0l9n.webp'),(8,37,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029596/ixaspgjuomuindslxpid.webp'),(8,38,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029596/tvkzrllbezayzw2cqfdc.webp'),(9,39,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029800/tfy69gcgsjxgjksjuqyq.webp'),(9,40,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029800/p0xsfmijr5lmi53mreq7.webp'),(9,41,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029800/r323t0s1fh34dxjzfmrf.webp'),(9,42,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723029800/jp4za8ylw2yxl7qohbrx.webp'),(10,43,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030151/sjpxb45t875ivq2nacz8.jpg'),(10,44,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030151/pdd027t4qmdpzfpfc5un.jpg'),(10,45,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030151/z08coc7yockcttdz3zpj.jpg'),(10,46,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030151/ejdgf8r9cp48180a6vjz.jpg'),(11,47,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030296/zjqq9wsgrlnqh0myv2hh.jpg'),(11,48,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030296/ptc2lyijjtqn2atipbfx.jpg'),(11,49,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030297/i2dfezekuik53zxh7txp.jpg'),(11,50,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030296/xjj6g2gypdhobka8229k.jpg'),(12,51,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030467/igrawye97uuijjtawfup.webp'),(12,52,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030468/y6cce9eqht3h1ya8pvct.jpg'),(12,53,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030467/cphpwxsrzfjlsmpyikya.webp'),(12,54,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030467/cxq93aq0gcrtlvtbi0gg.webp'),(13,55,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030577/mgdrsvddd7rburgrqxng.jpg'),(13,56,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030577/puxjltc2bk4ljaeirkuw.webp'),(13,57,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030577/qqbrxvukgm4spw3v6vh4.webp'),(13,58,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030578/ropiwdfxdjb75hvrg5tg.jpg'),(14,59,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030698/rsqpn2ygv6mkqqlgdp3r.webp'),(14,60,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030698/mn7myfodhfekqqacsrsm.webp'),(14,61,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030698/ogsphzhobkvpe0zpftlt.webp'),(14,62,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030698/ftfj9eu7kloamkklyz8e.webp'),(15,63,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030871/eg8osgnyb5aayhxewu03.webp'),(15,64,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030871/asyrlr9myfkjoqnt1uwq.webp'),(15,65,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030871/jwafbeodlcvhgpyuqzuo.webp'),(15,66,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723030871/iymfyodh5ohsmvllyfnw.webp'),(16,67,'https://res.cloudinary.com/dbammk7wt/image/upload/v1723191960/akq86tpw5hq0vjmxhle5.jpg');
/*!40000 ALTER TABLE `hotel_images` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-10  2:47:05
