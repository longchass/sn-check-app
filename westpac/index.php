<?php
$filename_dir = __DIR__ . "/data.txt";
$my_file = fopen($filename_dir, "r");
$pair_result = array();
$percent = array();
$tempTextHolder = array();
$code = array();
$holder = array();
// APIR
while (!feof($my_file)) {
    $result = strtoupper(fgets($my_file));
    // if (strpos($result, 'SECURITY') !== false || 
    // strpos($result, 'APPROVED') !== false || 
    // strpos($result, 'SECURITIES') !== false ||
    // strpos($result, 'RATIOS') !== false ||
    // strpos($result, 'CONTACT') !== false ||
    // strpos($result, 'INDICATES') !== false ||
    // strpos($result, 'APIR') !== false) {
    // echo $result;
    // } else {
    if (strpos($result, '%') !== false) {
        $codeResult = explode(" ", $result);
        // array_push($tempTextHolder, $codeResult);
        array_push($pair_result, ["code" => $codeResult[0], "LVR" => end($codeResult)]);
    }

    // if (strpos($result, '%') !== false && strlen($result) < 5) {
    //     array_push($holder, $tempTextHolder);
    //     $tempTextHolder = array();
    // }

    // }
}

foreach($pair_result as $value) {
    echo $value['code']. ": ".$value['LVR']."\n";
}


fclose($my_file);
