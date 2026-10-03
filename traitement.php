<?php
$pdo = new PDO("mysql:jost=localhost;dbname=tourisme;charset=utf8mb4", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "INSERT INTO reservations
    (nom_complet, email, telephone, destination, date_souhaitee, nb_voyageurs, message)
    VALUES (:nom, :email, :tel, :dest, :date, :nb, :msg)";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':nom' => $_POST['name'],
    ':email' => $_POST['email'],
    ':tel' => $_POST['phone'],
    ':dest' => $_POST['destination'],
    ':date' => $_POST['date'],
    ':nb' => $_POST['travelers'],
    ':msg' => $_POST['message'],
]);

echo "Réservation enregistrée.";