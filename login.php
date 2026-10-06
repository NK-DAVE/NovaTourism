<?php
session_start();

//Ici c'est le hash généré par hash.php qui corespond au mot de passe admin
$hashAdmin = '$2y$10$chpTq1QNQHwZ8tfWFdSJ/uFKSLjFZliToLJ064m2uMGW3dD2bhIPG';

$erreur = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $motDePasse = $_POST['password'] ?? '';
    
    //vérifie que le mot de passe entrer correspond a celui de l'admin
    if (password_verify($motDePasse, $hashAdmin)) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        header('Location: admin.php');
        exit;
    }

    $erreur = "Mot de passe incorrect.";
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Administration</title>
    <link rel="stylesheet" href="style.css">
    <link rel="shortcut icon" href="Asset/images/logo.jpg" type="image/x-icon">
</head>

<body class="admin-page">

    <div class="admin-bar">
        <div class="logo">N<span>K.</span></div>
        <a href="index.html" class="btn">Retour au site</a>
    </div>

    <main class="admin-main login">
        <h1 class="admin-title">Espace <span>admin</span></h1>
        <p class="admin-subtitle">Entrez le mot de passe pour voir les réservations.</p>

        <?php if ($erreur !== ''): ?>
            <p style="color: #c0392b; margin-bottom: 15px;"><?= htmlspecialchars($erreur) ?></p>
        <?php endif; ?>

        <form method="POST" action="login.php" class="booking-form">
            <div class="form-field">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Se connecter</button>
        </form>
    </main>

</body>

</html>
