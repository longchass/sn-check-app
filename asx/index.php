<?php



$still_moving = true;
while ($still_moving) {
    $still_moving = false;
    $files = scandir(".");
    $holder = array();
    $ignore_dot = array(".", "..");
    foreach ($files as $file) {
        if (!in_array($file, $ignore_dot)) {
            $temp = [];

            if (is_dir($file)) {


                if ($dh = opendir("$file/ASX")) {
                    while (($f = readdir($dh)) !== false) {

                        if (!in_array($f, $ignore_dot)) {
                            // echo $file . "\n\r";
                            array_push($temp, $f);
                        }
                    }
                    closedir($dh);
                }
            }
            array_push($holder, [$file => $temp]);
        }
    }

    // remove the last file which is the index.php
    array_pop($holder);



    foreach ($holder as $hold) {
        foreach ($hold as $date) {
            $next_date_holder = next($holder);
            foreach ($date as $file) {
                if ($next_date_holder) {
                    $temp = (array_values($next_date_holder)[0]);
                    $date_next = key($next_date_holder);
                    $current_date = key($hold);

                    if (!in_array($file, $temp)) {
                        // print_r($file . "\n\r");
                        $path = getcwd();
                        // echo getcwd();
                        $still_moving = true;
                        rename("$path/$current_date/ASX/$file", "$path/$date_next/ASX/$file");
                    }
                }
            }
        }
    }
}



// $check = "BAD";

// $tem = ["20160405" => ["BAD", "GAM.csv"]];


// // print_r($tem);

// if(in_array($check, array_values($tem)[0])) {
//     echo "work";
// }
