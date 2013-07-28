/*
SQLyog Enterprise - MySQL GUI v5.22
Host - 5.1.46-community : Database - lzdx_cxzx_db
*********************************************************************
Server version : 5.1.46-community
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `lzdx_cxzx_db`;

USE `lzdx_cxzx_db`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `news` */

DROP TABLE IF EXISTS `news`;

CREATE TABLE `news` (
  `news_code` varchar(100) NOT NULL,
  `news_title` varchar(255) DEFAULT NULL,
  `news_content` text,
  `news_link` varchar(255) DEFAULT NULL,
  `create_date` date DEFAULT NULL,
  `news_source` varchar(255) DEFAULT NULL,
  `news_picture` varchar(255) DEFAULT NULL,
  `news_tag` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `news_priority` smallint(6) DEFAULT NULL,
  `news_type` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`news_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Table structure for table `picture` */

DROP TABLE IF EXISTS `picture`;

CREATE TABLE `picture` (
  `picture_code` varchar(50) NOT NULL,
  `picture_name` varchar(100) DEFAULT NULL,
  `picture_path` varchar(255) DEFAULT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`picture_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Table structure for table `picture_news_relation` */

DROP TABLE IF EXISTS `picture_news_relation`;

CREATE TABLE `picture_news_relation` (
  `picture_code` varchar(50) CHARACTER SET gbk COLLATE gbk_bin NOT NULL,
  `news_code` varchar(50) CHARACTER SET gbk COLLATE gbk_bin NOT NULL,
  PRIMARY KEY (`picture_code`,`news_code`),
  KEY `FK_pnr_n` (`news_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Table structure for table `subjects` */

DROP TABLE IF EXISTS `subjects`;

CREATE TABLE `subjects` (
  `subject_code` varchar(50) NOT NULL,
  `cn_name` varchar(255) DEFAULT NULL,
  `en_name` varchar(255) DEFAULT NULL,
  `default_link` varchar(255) DEFAULT NULL,
  `type` varchar(5) DEFAULT NULL,
  `parent_subject_code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`subject_code`)
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*Table structure for table `subjects_news_relation` */

DROP TABLE IF EXISTS `subjects_news_relation`;

CREATE TABLE `subjects_news_relation` (
  `subject_code` varchar(50) NOT NULL,
  `news_code` varchar(100) NOT NULL,
  PRIMARY KEY (`subject_code`,`news_code`),
  KEY `FK_snr_n` (`news_code`),
  CONSTRAINT `FK_snr_n` FOREIGN KEY (`news_code`) REFERENCES `news` (`news_code`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

/*---------------- users ----------------------*/
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users`(
	`user_code` VARCHAR(100) NOT NULL,
	`user_name` VARCHAR(100),
	`password` VARCHAR(100),
	`role` INT(3) DEFAULT 3 COMMENT '0:superadmin,1:admin,2:common user,3:undefined',
	`status` INT(3) DEFAULT 1 COMMENT '1:valid,0:invalid',
	`create_date` DATETIME,
	PRIMARY KEY (`user_code`)
) ENGINE=INNODB CHARSET=gbk COLLATE=gbk_chinese_ci; 
INSERT INTO `users` (`user_code`, `user_name`, `password`, `role`, `status`, `create_date`)
VALUES ('402981854b1f216601401f2ea8540201', 'superadmin', '123456', '0', '1', now());

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
