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
  
  //Code from C9 community:
  
  //Connect to the database
    $host = "127.0.0.1";
    $user = "grinbergjeff";                     //Your Cloud 9 username
    $pass = "";                                  //Remember, there is NO password by default!
    $db = "WCP29";                                  //Your database name you want to connect to
    $port = 3306;                                //The port #. It is always 3306
    
    $connection = mysqli_connect($host, $user, $pass, $db, $port)or die(mysql_error());



    //And now to perform a simple query to make sure it's working
    $query = "SELECT * FROM buildings";
    $result = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        echo "The Building Name is: " . $row['name'] . " and the ID is: " . $row['id'];
    }
?>