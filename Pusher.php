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
  
  /////////////////////////////////Code from C9 community:
  
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
        echo "The Building Name is: " . $row['name'] . " and the ID is: " . $row['id'] . "\n";
    }
    
    //sql to delete table
    $sql = "DROP TABLE SamplePush";
    if ($connection->query($sql) === TRUE) {
        echo "Table SamplePush deleted successfully \n";
    } else {
        echo "Error deleting table: " . $connection->error;
    }
    
    // sql to create table
    $sql = "CREATE TABLE SamplePush (
    nodeID INT(30) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    feat_name VARCHAR(30) NOT NULL,
    feat_id INT(30) NOT NULL,
    x_cord FLOAT,
    y_cord FLOAT,
    access CHARACTER(10) NOT NULL
    )";
    
    if ($connection->query($sql) === TRUE) {
        echo "Table SamplePush created successfully \n";
    } else {
        echo "Error creating table: " . $connection->error;
    }

    $connection->close();
?>