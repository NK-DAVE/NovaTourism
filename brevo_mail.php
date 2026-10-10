<?php
// Envoie l'email de confirmation via l'API de Brevo (HTTPS, pas de SMTP).
// Retourne true si l'envoi a réussi, false sinon (l'erreur est écrite dans le journal PHP).
// Les secrets (clé API, expéditeur) sont lus dans config_mail.php, qui n'est PAS envoyé sur GitHub.

function envoyerConfirmation(string $email, string $nom, string $destination, string $date, int $nb): bool
{
    if(!function_exists('curl_init')) {
        error_log('Brevo : cURL indisponible.');
        return false;
    }
    $fichierConfig = __DIR__ . '/config_mail.php';
    if(!file_exists($fichierConfig)) {
        error_log('Brevo : config_mail.php introuvable.');
        return false;
    }
    require $fichierConfig;

    // On protège les données du visiteur avant de les mettre dans le HTML de l'email
    $nomSur  = htmlspecialchars($nom, ENT_QUOTES, 'UTF-8');
    $destSur = htmlspecialchars($destination, ENT_QUOTES, 'UTF-8');
    $dateSur = htmlspecialchars(date('d/m/Y', strtotime($date)), ENT_QUOTES, 'UTF-8');

    $html = "
        <h2>Merci pour votre demande, {$nomSur} !</h2>
        <p>Nous avons bien reçu votre demande de réservation :</p>
        <ul>
            <li><strong>Destination :</strong> {$destSur}</li>
            <li><strong>Date souhaitée :</strong> {$dateSur}</li>
            <li><strong>Voyageurs :</strong> {$nb}</li>
        </ul>
        <p>Nous vous contacterons très bientôt pour confirmer les détails.</p>
        <p>L'équipe {$MAIL_NOM}</p>
    ";

    $donnees = [
        'sender'      => ['name' => $MAIL_NOM, 'email' => $MAIL_EXPEDITEUR],
        'to'          => [['email' => $email, 'name' => $nom]],
        'subject'     => 'Confirmation de votre demande de réservation',
        'htmlContent' => $html,
    ];

    $ch = curl_init('https://api.brevo.com/v3/smtp/email');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_HTTPHEADER     => [
            'accept: application/json',
            'api-key: ' . $BREVO_API_KEY,
            'content-type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($donnees),
    ]);

    $reponse = curl_exec($ch);
    $code    = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code < 200 || $code >= 300) {
        error_log('Brevo : erreur ' . $code . ' - ' . $reponse);
        return false;
    }

    return true;
}
