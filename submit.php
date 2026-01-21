<?php
// submit.php
header('X-Powered-By: PHP');
// Accepts POST fields: name, email, phone, course, bio
function sanitize($v){ return trim(htmlspecialchars($v, ENT_QUOTES)); }

$name  = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$course= isset($_POST['course'])? sanitize($_POST['course']): '';
$bio   = isset($_POST['bio'])  ? sanitize($_POST['bio']) : '';

if(!$name || !$email){
    http_response_code(400);
    echo "Missing required fields (name & email).";
    exit;
}

// prepare CSV line
$ts = date('Y-m-d H:i:s');
$row = [$ts, $name, $email, $phone, $course, $bio];
$csvLine = '"' . implode('","', array_map(function($s){ return str_replace('"','""',$s); }, $row)) . '"' . PHP_EOL;

// file path
$file = __DIR__ . '/submissions.csv';

// try to append
if(file_put_contents($file, $csvLine, FILE_APPEND | LOCK_EX) === false){
    http_response_code(500);
    echo "Failed to save submission; check file permissions.";
    exit;
}

// If request originates from fetch/ajax, return text/json; otherwise simple message
if(stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false || !empty($_SERVER['HTTP_X_REQUESTED_WITH'])){
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status'=>'ok','timestamp'=>$ts,'message'=>'Saved successfully']);
} else {
    echo "Saved successfully at $ts. Thank you, $name.";
}
?>
