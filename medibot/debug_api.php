<?php
$json = file_get_contents('http://localhost/api/appointments');
echo "LONGITUD JSON RECIBIDO: " . strlen($json) . "\n";
$data = json_decode($json, true);
echo "KEYS: " . implode(", ", array_keys($data)) . "\n";
if (isset($data['hydra:member'])) {
    echo "NUMERO DE ELEMENTOS: " . count($data['hydra:member']) . "\n";
    if (count($data['hydra:member']) > 0) {
        print_r($data['hydra:member'][0]);
    }
} else {
    echo "NO HAY HYDRA MEMBER\n";
    echo $json;
}
