DROP DATABASE IF EXISTS covid_web_app;
CREATE DATABASE covid_web_app;
USE covid_web_app;


/*Table structure for users*/

CREATE TABLE users (
	u_id int NOT NULL AUTO_INCREMENT,
	given_name VARCHAR(255) DEFAULT NULL,
	surname VARCHAR(255) DEFAULT NULL,
	username VARCHAR(255) NOT NULL UNIQUE,
	user_type VARCHAR(16) NOT NULL,
	password VARCHAR(256) NOT NULL,
	PRIMARY KEY (u_id),

	CHECK (user_type = "admin" OR user_type="user" OR user_type="venue")

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/*Table structure for venues*/

CREATE TABLE venues (
	v_code int NOT NULL AUTO_INCREMENT,
	venue_name VARCHAR(63) NOT NULL,
	user int NOT NULL,
	longitude DOUBLE NOT NULL,
	latitude DOUBLE NOT NULL,
	PRIMARY KEY (v_code),
	FOREIGN KEY (user) REFERENCES users (u_id)


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




/*Table structure for check_ins*/

CREATE TABLE check_ins (
	c_id int UNSIGNED NOT NULL AUTO_INCREMENT,
	venue int DEFAULT NULL,
	user int NOT NULL,
	time varchar(63) NOT NULL,
	PRIMARY KEY(c_id),
	FOREIGN KEY (venue) REFERENCES venues (v_code) ON DELETE CASCADE,
	FOREIGN KEY (user) REFERENCES users (u_id) ON DELETE CASCADE


) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES check_ins WRITE;
UNLOCK TABLES;


/*Table structure for hotspots*/

CREATE TABLE hotspots (
	h_id int NOT NULL AUTO_INCREMENT,
	venue int NOT NULL,
	start_time varchar(63) NOT NULL,
	end_time varchar(63) NOT NULL,
	PRIMARY KEY (h_id),
	FOREIGN KEY (venue) REFERENCES venues (v_code) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES (1,'Overlord','Tim','Admin','admin','$argon2i$v=19$m=4096,t=3,p=1$CWptly06YwqhuWggLrULFQ$0uFifbh8ivlMvLYwD6SAkjnfxYd7AWJ+ht9m/gkm4Jg'),(2,'Disney','Land','Venue','venue','$argon2i$v=19$m=4096,t=3,p=1$WHYJGA2Lhc2B8YGVtPGRPQ$ikpEkdnJammhANBW33wRZ3Hf2WmGNR180q5f3mkgwq0'),(3,'User','User','User','user','$argon2i$v=19$m=4096,t=3,p=1$EEJppBFyGZeYNQUFxtWWtQ$Td+P7n7fZH0cERmc4qRd0tMGygRijWDrjCzzG1RHye8');


