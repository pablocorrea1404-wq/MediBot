<?php
$ch = curl_init('http://localhost/api/appointments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
if (count($data) > 0) {
    $item = $data[0];
    echo "KEYS EN PRIMER ITEM: " . implode(", ", array_keys($item)) . "\n";

    echo "Check appointmentDate: " . (isset($item['appointmentDate']) ? "SI (" . $item['appointmentDate'] . ")" : "NO") . "\n";
    echo "Check patient: " . (isset($item['patient']) ? "SI (Es " . gettype($item['patient']) . ")" : "NO") . "\n";

    if (isset($item['patient']) && is_array($item['patient'])) {
        echo "Patient keys: " . implode(", ", array_keys($item['patient'])) . "\n";
    }
} else {
    echo "ARRAY VACIO\n";
}
