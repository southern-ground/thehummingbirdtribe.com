<?php
/**
 * Created by PhpStorm.
 * User: fst
 * Date: 12/11/17
 * Time: 10:35 AM
 */

error_reporting(E_ALL); ini_set('display_errors', 1);

$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

// Form variable(s)
$email = $_POST['email'];

$full_name = $_POST['full_name'];
$address_one = $_POST['address_one'];
$address_two = $_POST['address_two'];
$city = $_POST['city'];
$state = $_POST['state'];
$zip = $_POST['zip'];
$country = $_POST['country'];
$email = $_POST['email'];

require_once('hbt-data.php');

// Create connection
$dbconn = new mysqli($GIFT_DB_SERVER, $GIFT_DB_USER, $GIFT_DB_PW, $GIFT_DB_NAME);

$query = 'n/a';
$error = 'n/a';
$conn = 'n/a';

// Check connection
if ($dbconn->connect_error) {
    $conn = "Connection failed: " . $dbconn->connect_error;
}else{
    $conn = "Connected successfully";

    // Carry on.

    $now = date('Y-m-d H:i:s');

    $query = "INSERT INTO $GIFT_DB_TABLE (date_created, full_name, address_one, address_two, city, state, country, zip, email) VALUES ('$now', '$full_name', '$address_one', '$address_two', '$city', '$state', '$country', '$zip', '$email')";

    if ($dbconn->query($query) === TRUE) {
        $error = "New record created successfully";
        $status = 200;
    } else {
        $error = "Error: " . $query . "<br>" . $dbconn->error;
        $status = 500;
    }

}

// $dbconn->close();

$data =["status" => $status, "error" => $error]; // "message" => $app_message, "email" => $_POST['email']];

header('Content-type: application/json');

die(json_encode($data, JSON_FORCE_OBJECT));