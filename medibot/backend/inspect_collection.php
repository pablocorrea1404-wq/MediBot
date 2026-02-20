<?php
// Script para inspeccionar la respuesta de la colección de citas
$ch = curl_init('http://localhost/api/appointments');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);
$response = curl_exec($ch);
curl_close($ch);

echo "--- RESPUESTA API (primeros 2000 carácteres) ---\n";
echo substr($response, 0, 2000);
echo "\n------------------------------------------------\n";

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo "ERROR JSON: " . json_last_error_msg();
} else {
    echo "Tipo de dato raíz: " . gettype($data) . "\n";
    if (is_array($data)) {
        echo "Número de elementos: " . count($data) . "\n";
        if (count($data) > 0) {
            echo "--- ESTRUCTURA PRIMER ELEMENTO ---\n";
            print_r($data[0]);
        }
    }
}
