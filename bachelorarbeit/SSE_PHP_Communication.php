<?php

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

//variables
$temperature = rand(0,100);
$airPressure = rand(0, 1000);
$humidity = rand(0, 100);
$flow = rand(0, 100);
$speed = rand(0, 20);
$numberOfWheels = 4;

$idCounter = -1;

$jsonArray=array(
    "id" => $idCounter,
    "temperature[C]" => $temperature,
    "air_pressure[Pa]" => $airPressure,
    "humidity[%]" => $humidity,
    //"flow[m^3/s]" => $flow,
    "speed[m/s]" => $speed,
    "number_of_wheels[#]" => $numberOfWheels
);

while(TRUE){
    //changing the values of the sensors randomly
    foreach ($jsonArray as $x => $x_value){
        if ($x == "id") {
            $jsonArray[$x] ++;
        }
        else if ($x == "number_of_wheels[#]") {
            $jsonArray[$x] += rand(-1,1);
        }
        else {
            $jsonArray[$x] += rand(-20,20);
        }
    }


    //building json object
    $json = json_encode($jsonArray);

    echo "data: $json\n\n";
   // $time = date('r');
    // echo "data: The server time is: {$time}\n\n";

    ob_flush();
    flush();
    sleep(1);
    $idCounter++;
}
?>