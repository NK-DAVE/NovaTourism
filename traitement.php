<?php
if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

try {
    //Connexion
    $pdo = new PDO("mysql:host=localhost;dbname=tourisme;charset=utf8mb4", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "INSERT INTO reservations
    (nom_complet, email, telephone, destination, date_souhaitee, nb_voyageurs, message)
    VALUES (:nom, :email, :tel, :dest, :date, :nb, :msg)";

    //Nettoyage des valeurs conversions en chaine, nombre et suppression des espaces avant et après
    $nom = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $tel = trim($_POST['phone'] ?? '');
    $dest = trim($_POST['destination'] ?? '');
    $date = trim($_POST['date'] ?? '');
    $nb = (int)($_POST['travelers'] ?? 1);
    $msg = trim($_POST['message'] ?? '');

    //créetion de la liste d'erreurs
    $erreurs = [];

    if (empty($nom)) { $erreurs[] = "Le nom est obligatoire.";}
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $erreurs[] = "Votre adresse doit être valide."; }
    if (empty($tel)) { $erreurs[] = "Le numéro de téléphone est obligatoire.";}
    if (empty($dest)) { $erreurs[] = "La destination est obligatoire.";}
    if ($nb < 1) { $erreurs[] = "Le nombre de voyageurs doit être d'au moins 1.";}
    if (empty($date)) { $erreurs[] = "La date est obligatoire.";}

    //si la liste contient quelque choses afficher
    if (!empty($erreurs)) {
        foreach ($erreurs as $erreur) {
            echo $erreur . "<br>";
        }
        exit;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nom' => $nom,
        ':email' => $email,
        ':tel' => $tel,
        ':dest' => $dest,
        ':date' => $date,
        ':nb' => $nb,
        ':msg' => $msg
    ]);

    echo "Réservation enregistrée.";
} catch (PDOException $e) {
    error_log($e->getMessage());
    echo "Une erreur est survenue, merci de réessayer plus tard";
}