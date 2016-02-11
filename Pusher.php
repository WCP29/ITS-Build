<?php
    
    $date = $_POST['date'];
    $map = $_POST['map'];
    
    echo $date;
    echo "\n";
    echo $map;
    echo "\n";
    print_r(array_values($map)); 
    
    
   /* $directions = json_decode($_POST['map']);
    var_dump($directions);
    */
?>