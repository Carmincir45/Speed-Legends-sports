<?php
session_start();

// Simuliamo un utente con username e password predefiniti
$utente_corretto = "admin";
$password_corretta = "1234"; // In un'app reale, usa password hashate!

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if ($username == $utente_corretto && $password == $password_corretta) {
        $_SESSION["loggedin"] = true;
        $_SESSION["username"] = $username;
        header("Location: D:\test\Speed legends.html");
        exit;
    } else {
        echo "Credenziali errate. <a href='index.php'>Riprova</a>";
    }
}
?>
