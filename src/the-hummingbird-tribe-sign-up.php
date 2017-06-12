<?php
/**
 * Created by PhpStorm.
 * User: fst
 * Date: 6/9/17
 * Time: 4:35 PM
 */

require_once('hbt-data.php');

/*
    ^^^ Defines the following ^^^
    $PUBLIC_API_KEY
    $PRIVATE_API_KEY
    $ACCOUNT_ID
    $GROUP_IDS
*/

$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

// Form variable(s)
$email = $_POST['email'];

// Member data other than email should be passed in an array called "fields"
$member_data = array("email" => $email, "group_ids" => $GROUP_IDS);

$url = "https://api.e2ma.net/".$ACCOUNT_ID."/members/add";

$ch = curl_init();

curl_setopt($ch, CURLOPT_USERPWD, $PUBLIC_API_KEY . ":" . $PRIVATE_API_KEY);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, count($member_data));
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($member_data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$head = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

//execute post
if($http_code > 200) {
    $app_message = "Error sending subscription request";
} else {
    $app_message = "Success!";
}

$data =["status" => $http_code, "message" => $app_message, "email" => $_POST['email']];

header('Content-type: application/json');

die(json_encode($data, JSON_FORCE_OBJECT));

