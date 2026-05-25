<?php
/**
 * hostinger-secure-receiver.php
 * 
 * Secure HTTP Multipart upload receiver for Hostinger persistence.
 * Implements HMAC-SHA256 signature verification and replay prevention.
 */

// Configure headers for standard CORS and responses
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: X-Media-Signature, X-Media-Timestamp, Content-Type");
header("Content-Type: application/json; charset=utf-8");

// Exit early on preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit;
}

// 1. Compatible helper to fetch request headers under Apache/Nginx
function getHeaderCompat($name) {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        // Check case-insensitive
        foreach ($headers as $key => $value) {
            if (strcasecmp($key, $name) === 0) {
                return $value;
            }
        }
    }
    
    // Server environment variables fallback
    $serverKey = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
    if (isset($_SERVER[$serverKey])) {
        return $_SERVER[$serverKey];
    }
    
    return null;
}

// 2. Load keys and configuration parameters
$secret = getenv('MEDIA_UPLOAD_SECRET');
if (empty($secret)) {
    http_response_code(500);
    echo json_encode(["error" => "MEDIA_UPLOAD_SECRET is not configured on the Hostinger server environment."]);
    exit;
}
$uploadDir = __DIR__ . '/../uploads/';

// 3. Extract authentication headers
$signature = getHeaderCompat('X-Media-Signature');
$timestampStr = getHeaderCompat('X-Media-Timestamp');
$timestamp = $timestampStr ? intval($timestampStr) : 0;

if (!$signature || !$timestamp) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required authentication headers (X-Media-Signature or X-Media-Timestamp)"]);
    exit;
}

// 4. Time Window Control (Replay Attack Mitigation)
$currentTime = time();
$timeDifference = abs($currentTime - $timestamp);
if ($timeDifference > 30) {
    http_response_code(403);
    echo json_encode([
        "error" => "Timestamp expired or clock desynchronized",
        "difference_seconds" => $timeDifference
    ]);
    exit;
}

// 5. Verify payload existence
if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["error" => "No file payload received"]);
    exit;
}

$file = $_FILES['file'];
$fileName = basename($file['name']);
$fileSize = $file['size'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "File upload returned error code: " . $file['error']]);
    exit;
}

// 6. Cryptographic signature validation
// Signature = HMAC-SHA256(secret, timestamp + fileName + fileSize)
$message = $timestamp . $fileName . $fileSize;
$expectedSignature = hash_hmac('sha256', $message, $secret);

if (!hash_equals($expectedSignature, $signature)) {
    http_response_code(403);
    echo json_encode([
        "error" => "Invalid cryptographic signature",
        "debug_message_len" => strlen($message)
    ]);
    exit;
}

// 7. Sanitize extension and type
$allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'mp3'];
$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($fileExt, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(["error" => "File extension '." . $fileExt . "' is not allowed"]);
    exit;
}

// Strip special characters to prevent directory traversals
$cleanName = preg_replace("/[^a-zA-Z0-9_\-]/", "", pathinfo($fileName, PATHINFO_FILENAME));
$finalName = time() . '-' . $cleanName . '.' . $fileExt;

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 8. Commit file to physical storage on Hostinger
$destination = $uploadDir . $finalName;
if (move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "filename" => $finalName,
        "url" => "https://media.partnersiasolutions.com/uploads/" . $finalName,
        "size" => $fileSize
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to write file to disk on Hostinger"]);
}
?>
