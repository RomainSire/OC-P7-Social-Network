SET NAMES utf8;

-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Sam 03 Octobre 2020 à 11:13
-- Version du serveur :  5.7.31-0ubuntu0.18.04.1
-- Version de PHP :  7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `social_network`
--

-- --------------------------------------------------------

--
-- Structure de la table `Comments`
--

CREATE TABLE `Comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `publication_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text NOT NULL,
  `user_id` smallint(5) UNSIGNED DEFAULT NULL,
  `post_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Comments`
--

INSERT INTO `Comments` (`id`, `publication_date`, `content`, `user_id`, `post_id`) VALUES
(8, '2020-09-23 12:20:26', 'C\'est ou exactement à Okinawa ?', 16, 15),
(9, '2020-09-23 12:21:11', 'Ishigaki, au sud !', 17, 15),
(12, '2020-09-24 11:20:53', 'Pas mal pour travailler au calme...', 13, 11),
(13, '2020-09-24 11:36:12', 'Omitto iuris dictionem in libera civitate contra leges senatusque consulta; caedes relinquo; libidines praetereo, quarum acerbissimum extat indicium et ad insignem memoriam turpitudinis et paene ad iustum odium imperii nostri, quod constat nobilissimas virgines se in puteos abiecisse et morte voluntaria necessariam turpitudinem depulisse. Nec haec idcirco omitto, quod non gravissima sint, sed quia nunc sine teste dico.', 13, 13),
(17, '2020-09-28 11:34:38', 'Petit test', 13, 12),
(26, '2020-09-28 14:40:31', 'Très joli bleu!..', 13, 15);

-- --------------------------------------------------------

--
-- Structure de la table `Likes`
--

CREATE TABLE `Likes` (
  `id` int(10) UNSIGNED NOT NULL,
  `rate` tinyint(4) NOT NULL,
  `user_id` smallint(5) UNSIGNED NOT NULL,
  `post_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Likes`
--

INSERT INTO `Likes` (`id`, `rate`, `user_id`, `post_id`) VALUES
(9, 1, 16, 13),
(10, -1, 16, 12),
(24, 1, 13, 11),
(36, 0, 13, 13),
(45, 1, 13, 7),
(47, 1, 13, 8),
(51, 1, 15, 14),
(57, 0, 16, 14),
(61, 1, 16, 15),
(69, 1, 13, 10),
(73, 1, 13, 15),
(74, 1, 13, 14);

-- --------------------------------------------------------

--
-- Structure de la table `Notifications`
--

CREATE TABLE `Notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` smallint(5) UNSIGNED NOT NULL,
  `initiator_id` smallint(5) UNSIGNED DEFAULT NULL,
  `post_id` mediumint(8) UNSIGNED NOT NULL,
  `type_id` tinyint(3) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Notifications`
--

INSERT INTO `Notifications` (`id`, `user_id`, `initiator_id`, `post_id`, `type_id`) VALUES
(28, 16, 13, 15, 3),
(29, 16, 13, 14, 1),
(30, 16, 13, 14, 2),
(32, 16, 15, 14, 1),
(36, 16, 13, 15, 3),
(37, 16, 16, 14, 1),
(39, 17, 13, 15, 1),
(40, 17, 13, 15, 1),
(41, 17, 13, 15, 1),
(42, 17, 13, 15, 1),
(43, 16, 13, 14, 1);

-- --------------------------------------------------------

--
-- Structure de la table `Notification_types`
--

CREATE TABLE `Notification_types` (
  `id` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Notification_types`
--

INSERT INTO `Notification_types` (`id`, `name`) VALUES
(1, 'reaction'),
(2, 'comment'),
(3, 'answer');

-- --------------------------------------------------------

--
-- Structure de la table `Posts`
--

CREATE TABLE `Posts` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `publication_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` smallint(5) UNSIGNED DEFAULT NULL,
  `imageurl` varchar(255) DEFAULT NULL,
  `content` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Posts`
--

INSERT INTO `Posts` (`id`, `publication_date`, `user_id`, `imageurl`, `content`) VALUES
(7, '2020-09-22 22:16:49', 13, NULL, 'I have spent my whole life scared, frightened of things that could happen, might happen, might not happen, 50 years I spent like that. Finding myself awake at three in the morning. But you know what? Ever since my diagnosis, I sleep just fine. What I came to realize is that fear, that’s the worst of it. That’s the real enemy. So, get up, get out in the real world and you kick that bastard as hard you can right in the teeth.'),
(8, '2020-09-22 22:19:24', 13, 'http://localhost:3000/images/Walter\'s_Work_1600805964762.png', 'I have spent my whole life scared, frightened of things that could happen, might happen, might not happen, 50 years I spent like that. Finding myself awake at three in the morning. But you know what? Ever since my diagnosis, I sleep just fine. What I came to realize is that fear, that’s the worst of it. That’s the real enemy. So, get up, get out in the real world and you kick that bastard as hard you can right in the teeth.'),
(10, '2020-09-23 11:34:08', 13, 'http://localhost:3000/images/Walter\'s_Work_1600853648683.png', NULL),
(11, '2020-09-23 11:44:33', 14, 'http://localhost:3000/images/small_home_1600854273223.png', 'J\'ai trouvé un nouveau chez-moi !'),
(12, '2020-09-23 11:52:53', 15, NULL, 'What do you say to the God of Procrastination ?  NOT TODAY !'),
(13, '2020-09-23 11:57:21', 15, 'http://localhost:3000/images/Titan_de_Braavos_1600855041530.png', 'Petite session drone sur les berges de Braavos'),
(14, '2020-09-23 12:03:41', 16, NULL, 'La première règle du Fight Club est : il est interdit de parler du Fight Club.\r\nLa seconde règle du Fight Club est : il est interdit de parler du Fight Club.'),
(15, '2020-09-23 12:15:20', 17, 'http://localhost:3000/images/okinawa_1600856120106.png', 'Mon dernier voyage à Okinawa');

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `pictureurl` varchar(255) DEFAULT NULL,
  `outline` varchar(255) DEFAULT NULL,
  `isadmin` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `Users`
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `pictureurl`, `outline`, `isadmin`) VALUES
(11, 'Mr Admin', 'mr.admin@email.com', 'U2FsdGVkX18FJljBPmEkRHS3no1WcAVKKqm/JymU9JBIWJxJ7Lr0/qkctgi1nXv+EhizDSokpiMdJ835Ax5z4M+eSL0/BOfFnO5bDtnaZR0=', NULL, NULL, 1),
(13, 'Walter White', 'walter.white@email.com', 'U2FsdGVkX1/Jf7U04jO2FaQASaFG6kIWzdkfXveDkGlDdqMRXxlM3GnHfMngr00qeV5M1etgae7cVjoonZyETy1Q+slLvgW9W917sOJynuI=', 'http://localhost:3000/images/Walter_White_1601128055201.png', 'If you don’t know who I am, then maybe your best course would be to tread lightly.', 0),
(14, 'Daryl Dixon', 'daryl.dixon@email.com', 'U2FsdGVkX1/M4WT7PItrnl5Y/cpEJQcDYrXQn7Zn8Y2fOx+bSG2wEFWodDvvdGx5S8RdI3LiRxvWOmNM/ViDNuDPEQNsuamLZ9E6i5xgXcQ=', 'http://localhost:3000/images/Daryl_Dixon_1600853872625.png', '\"Come on, people. What the hell?\" ', 0),
(15, 'Arya Stark', 'arya.stark@email.com', 'U2FsdGVkX1/MV341seNB6ydWnZGvQg5daR2LxNuQsN8lQXp6HmxC4Tvg+O2j/uJ8eDTwJ/vBU92jXXLn+40fzdKxM5/SXQsHDfyZHee+8yQ=', 'http://localhost:3000/images/Arya_Stark_1600854667218.png', 'A girl has no name', 0),
(16, 'Tyler Durden', 'tyler.durden@email.com', 'U2FsdGVkX1+vDCmGRAToZg543hqnWcnudkWAkZxHyc5ceUkxpJ5NV81MdeDFrKRv47yCbG0XcHYNVvzJFTTSBqnBTt5rUs6r7qPHHqJLtBg=', 'http://localhost:3000/images/Tyler_Durden_1600855300190.png', NULL, 0),
(17, 'Beatrix Kiddo', 'beatrix.kiddo@email.com', 'U2FsdGVkX1/KWh1owWWvfpR9iussWAn/wMk/MvuOprVHhMHkrGEglokATDhOsAOuEkjOiUyWFentlcE4lQKzn2LvQqIVnrZmuo66zBRpKgM=', 'http://localhost:3000/images/beatrix_kiddo_1600855914161.png', 'This is what you get for ****ing around with Yakuzas! Go home to your mother!', 0);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Comments_Users_id` (`user_id`),
  ADD KEY `fk_Comments_Posts_id` (`post_id`);

--
-- Index pour la table `Likes`
--
ALTER TABLE `Likes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Likes_Users_id` (`user_id`),
  ADD KEY `fk_Likes_Posts_id` (`post_id`);

--
-- Index pour la table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Notifications_Users_id` (`user_id`),
  ADD KEY `fk_Notifications_Initiator_id` (`initiator_id`),
  ADD KEY `fk_Notifications_Posts_id` (`post_id`),
  ADD KEY `fk_Notifications_Notifications_types_id` (`type_id`);

--
-- Index pour la table `Notification_types`
--
ALTER TABLE `Notification_types`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Posts`
--
ALTER TABLE `Posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_Posts_Users_id` (`user_id`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ind_uni_email` (`email`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `Comments`
--
ALTER TABLE `Comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT pour la table `Likes`
--
ALTER TABLE `Likes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
--
-- AUTO_INCREMENT pour la table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT pour la table `Notification_types`
--
ALTER TABLE `Notification_types`
  MODIFY `id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT pour la table `Posts`
--
ALTER TABLE `Posts`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `fk_Comments_Posts_id` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Comments_Users_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `Likes`
--
ALTER TABLE `Likes`
  ADD CONSTRAINT `fk_Likes_Posts_id` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Likes_Users_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `fk_Notifications_Initiator_id` FOREIGN KEY (`initiator_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notifications_Notifications_types_id` FOREIGN KEY (`type_id`) REFERENCES `Notification_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notifications_Posts_id` FOREIGN KEY (`post_id`) REFERENCES `Posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notifications_Users_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Posts`
--
ALTER TABLE `Posts`
  ADD CONSTRAINT `fk_Posts_Users_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
