<?php
$ch = curl_init('http://localhost/api/appointments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if (array_keys($data) === range(0, count($data) - 1)) {
    echo "ES UN ARRAY (JSON PURO)\n";
} else {
    echo "ES UN OBJETO (JSON-LD O ERROR)\n";
    print_r(array_keys($data));
}
echo "Primeros 100 chars: " . substr($response, 0, 100);
