<?php
$filename_dir = __DIR__ . "/data.txt";
$my_file = fopen($filename_dir, "r");
$pair_result = array();
$percent = array();
$tempTextHolder = array();
$code = array();
$holder = array();
// APIR   SUBJECT TO CHANGE
while (!feof($my_file)) {
    $result = strtoupper(fgets($my_file));
    if (
        strpos($result, 'SECURITY') !== false ||
        strpos($result, 'AS AT') !== false ||
        strpos($result, 'SUBJECT TO CHANGE') !== false
    ) { } elseif (strpos($result, '%') !== false && strlen($result) > 10) {
        $tempResult = explode(" ", $result);

        $tempCode = $tempResult[0];
        $tempLVR  = "";
        $reset = false;
        foreach ($tempResult as $key => $value) {
            if (strpos($value, '%') !== false && $reset === false) {
                array_push($holder, ["code" => $tempCode, "LVR" => $value]);
                $reset = true;
            }
            if(strpos($value, '%') !== false && $reset === true)
            {
                if($key !== count($tempCode)-1) {
                    if(!strpos($tempResult[$key+1], "%")) {
                        $tempCode = $tempResult[$key+1];
                        $tempLVR  = "";
                        $reset = false;
                    }
                }
            } 
        }
    }
}

echo "Total Result: " . count($holder) . "\n";

foreach($holder as $value) {
    echo $value['code']. ": ".$value['LVR']."\n";
}


fclose($my_file);
