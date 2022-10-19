-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: covid_web_app
-- ------------------------------------------------------
-- Server version	8.0.19-0ubuntu5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `covid_web_app`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `covid_web_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `covid_web_app`;

--
-- Table structure for table `check_ins`
--

DROP TABLE IF EXISTS `check_ins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `check_ins` (
  `c_id` int unsigned NOT NULL AUTO_INCREMENT,
  `venue` int DEFAULT NULL,
  `user` int NOT NULL,
  `time` varchar(63) NOT NULL,
  PRIMARY KEY (`c_id`),
  KEY `venue` (`venue`),
  KEY `user` (`user`),
  CONSTRAINT `check_ins_ibfk_1` FOREIGN KEY (`venue`) REFERENCES `venues` (`v_code`) ON DELETE CASCADE,
  CONSTRAINT `check_ins_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`u_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `check_ins`
--

LOCK TABLES `check_ins` WRITE;
/*!40000 ALTER TABLE `check_ins` DISABLE KEYS */;
INSERT INTO `check_ins` VALUES (1,2,2,'Fri Jun 11 2021'),(2,2,2,'Fri Jun 11 2021'),(5,5,3,'Fri Jun 11 2021'),(6,7,3,'Fri Jun 11 2021'),(7,7,5,'Fri Jun 11 2021'),(8,6,5,'Fri Jun 11 2021');
/*!40000 ALTER TABLE `check_ins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotspots`
--

DROP TABLE IF EXISTS `hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotspots` (
  `h_id` int NOT NULL AUTO_INCREMENT,
  `venue` int NOT NULL,
  `start_time` varchar(63) NOT NULL,
  `end_time` varchar(63) NOT NULL,
  PRIMARY KEY (`h_id`),
  KEY `venue` (`venue`),
  CONSTRAINT `hotspots_ibfk_1` FOREIGN KEY (`venue`) REFERENCES `venues` (`v_code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotspots`
--

LOCK TABLES `hotspots` WRITE;
/*!40000 ALTER TABLE `hotspots` DISABLE KEYS */;
/*!40000 ALTER TABLE `hotspots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `u_id` int NOT NULL AUTO_INCREMENT,
  `given_name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `user_type` varchar(16) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`u_id`),
  UNIQUE KEY `username` (`username`),
  CONSTRAINT `users_chk_1` CHECK (((`user_type` = _utf8mb4'admin') or (`user_type` = _utf8mb4'user') or (`user_type` = _utf8mb4'venue')))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Overlord','Tim','Admin','admin','$argon2i$v=19$m=4096,t=3,p=1$CWptly06YwqhuWggLrULFQ$0uFifbh8ivlMvLYwD6SAkjnfxYd7AWJ+ht9m/gkm4Jg'),(2,'Disney','Land','Venue','venue','$argon2i$v=19$m=4096,t=3,p=1$WHYJGA2Lhc2B8YGVtPGRPQ$ikpEkdnJammhANBW33wRZ3Hf2WmGNR180q5f3mkgwq0'),(3,'John','World','Venue1','venue','$argon2i$v=19$m=4096,t=3,p=1$rSUCVcFMOW0TB50yXybiNg$sf2ilPWKPGyxXl4pYaMKMKoMfaS8vi7tmMW/dS3Cn5U'),(4,'User','User','User','user','$argon2i$v=19$m=4096,t=3,p=1$EEJppBFyGZeYNQUFxtWWtQ$Td+P7n7fZH0cERmc4qRd0tMGygRijWDrjCzzG1RHye8'),(5,'Please','Work','testytest45654@gmail.com','admin','$argon2i$v=19$m=4096,t=3,p=1$lUhrbRq46kHLU+aWt93ThA$oOI+6EgoBqyxKllH9Su379pEqPoNTN3B5PIQoki+8dM'),(6,'Ron','Weasley','rweasley','user','$argon2i$v=19$m=4096,t=3,p=1$NmTkzbmTRhzqsJ/neC3mrw$6ublQ0uvLERimyJJBsz1I1Kg2X991557FT+nttHGdls'),(7,'John','Smith','johnSmithVenue','venue','$argon2i$v=19$m=4096,t=3,p=1$6bIXZKvkOgr0apMFGAekDw$MeOVtXd2fxg5YQC4fVGXZk5h3BSJR5MtG2lSRvBOlEY'),(8,'John','Smith','johnSmithUser','user','$argon2i$v=19$m=4096,t=3,p=1$IlmNoPEEul7BWioxYSxb1A$mF55MHEqObYuMcggqi3geNzVsXF9RduZnphAarhY1AI');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `v_code` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(63) NOT NULL,
  `user` int NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  PRIMARY KEY (`v_code`),
  KEY `user` (`user`),
  CONSTRAINT `venues_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`u_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Disney Land',3,34,138),(2,'Disney Land',3,34,138),(3,'Disney Land',3,34,138),(5,'Test',3,100,21),(6,'Test',3,100,21),(7,'Test',4,2,43),(8,'Test2',3,34,138),(9,'Uluru',5,131.0369,-25.3444);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-14  8:44:46
