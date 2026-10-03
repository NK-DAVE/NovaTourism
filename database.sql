-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 03 oct. 2026 à 22:37
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tourisme`
--

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'index',
  `nom_complet` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `destination` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_souhaitee` date NOT NULL,
  `nb_voyageurs` int NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `date_reservation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `nom_complet`, `email`, `telephone`, `destination`, `date_souhaitee`, `nb_voyageurs`, `message`, `date_reservation`) VALUES
(1, 'Konang Demano Dave Nathan', 'nathankonang26@gmail.com', '+237681588755', 'Cacaoyère de l’Est', '2009-09-20', 1, 'Savouré du cacao récolter par mes soins', '2026-10-03 21:36:57'),
(2, 'Konang Demano', 'konangdemano@gmail.com', '+237684851369', 'Parc national de la Bénoué', '2001-06-05', 6, 'Allez en ballade au près des éléphants', '2026-10-03 21:54:43'),
(3, 'demano', 'demano@gmail.com', '+237675526431', 'Côte paisible', '2008-12-20', 12, 'profité des plages luxuriantes', '2026-10-03 21:57:05'),
(4, 'Dave', 'dave@gmail.com', '+237642326485', 'Rivière paisible', '1972-09-20', 11, 'Séjour familial', '2026-10-03 22:16:18');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
