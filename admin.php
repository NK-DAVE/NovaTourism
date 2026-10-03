<?php
$pdo = new PDO("mysql:host=localhost;dbname=tourisme;charset=utf8mb4", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$reservations = $pdo
    ->query("SELECT * FROM reservations ORDER BY date_reservation DESC")
    ->fetchAll(PDO::FETCH_ASSOC);

$totalReservations = count($reservations);
$totalVoyageurs = array_sum(array_column($reservations, 'nb_voyageurs'));

// Petite fonction pour afficher du texte en toute sécurité
function e($valeur)
{
    return htmlspecialchars((string) $valeur, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration - Réservations</title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="Asset/images/logo.jpg" type="image/x-icon">
</head>

<body class="admin-page">

    <div class="admin-bar">
        <div class="logo">Nova <span>Techn.</span></div>
        <a href="index.html" class="btn">Retour au site</a>
    </div>

    <main class="admin-main">
        <h1 class="admin-title">Réservations <span>reçues</span></h1>
        <p class="admin-subtitle">Toutes les demandes envoyées depuis le site.</p>

        <div class="admin-stats">
            <div class="stat-card">
                <span class="stat-value"><?= $totalReservations ?></span>
                <span class="stat-label">Réservations</span>
            </div>
            <div class="stat-card">
                <span class="stat-value"><?= $totalVoyageurs ?></span>
                <span class="stat-label">Voyageurs au total</span>
            </div>
        </div>

        <?php if ($totalReservations === 0): ?>

            <div class="empty-state">
                <strong>Aucune réservation pour le moment</strong>
                Les demandes envoyées depuis le site apparaîtront ici.
            </div>

        <?php else: ?>

            <div class="table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Destination</th>
                            <th>Date souhaitée</th>
                            <th>Voyageurs</th>
                            <th>Message</th>
                            <th>Reçue le</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($reservations as $r): ?>
                            <tr>
                                <td class="cell-name" data-label="Nom"><?= e($r['nom_complet']) ?></td>
                                <td data-label="Email"><?= e($r['email']) ?></td>
                                <td data-label="Téléphone"><?= e($r['telephone']) ?></td>
                                <td data-label="Destination"><span class="badge"><?= e($r['destination']) ?></span></td>
                                <td data-label="Date souhaitée"><?= e(date('d/m/Y', strtotime($r['date_souhaitee']))) ?></td>
                                <td data-label="Voyageurs"><span class="count"><?= e($r['nb_voyageurs']) ?></span></td>
                                <td class="cell-message" data-label="Message"><?= e($r['message']) ?></td>
                                <td class="cell-date" data-label="Reçue le"><?= e(date('d/m/Y H:i', strtotime($r['date_reservation']))) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

        <?php endif; ?>
    </main>

</body>

</html>
