<?php
    
    $date = $_POST['date'];
    $map = $_POST['map'];
    
    echo $date;
    echo "\n";
    echo $map;
    echo "\n";
    print_r(array_values($map)); 
    echo "\n";
    
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
    /*
    $query = "SELECT * FROM buildings";
    $result = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        echo "The Building Name is: " . $row['name'] . " and the ID is: " . $row['id'] . "\n";
    }
    */
    
    
    //sql to delete table
 /*//////////////////////////////////////////////////////////////////////////
    $sql = "DROP TABLE SamplePush";
    if ($connection->query($sql) === TRUE) {
        echo "Table SamplePush deleted successfully \n";
    } else {
        echo "Error deleting table: " . $connection->error;
    }
    
    // sql to create table
    $sql = "CREATE TABLE SamplePush (
    buildingName VARCHAR(30) NOT NULL,
    floorNumber VARCHAR(30) NOT NULL,
    nodeID INT(30) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    feat_name VARCHAR(30) NOT NULL,
    feat_id VARCHAR(30) NOT NULL,
    x_cord INT,
    y_cord INT,
    access VARCHAR(10)
    );";
  
    if ($connection->query($sql) === TRUE) {
        echo "Table SamplePush created successfully \n";
    } else {
        echo "Error creating table: " . $connection->error;
    }
 *//////////////////////////////////////////////////////////////////////////// 
    ///////Enforcing a push from JS to mySQLi
    
    if(is_array($map)){
    
        $sql = "INSERT INTO SamplePush (buildingName, floorNumber, nodeID, feat_name, feat_id, x_cord, y_cord, access) VALUES ";
    
        $valuesArr = array();
        foreach($map as $row){
    
            $buildingName = $row['building'];
            $floorNumber = $row['floor'];
            $node_id = (int) $row['node_id'];
            $feat_name = ( $row['feat_name'] );
            $feat_id = ( $row['feat_id'] );
            $x_cord = (int) $row['x_cord'];
            $y_cord = (int) $row['y_cord'];
            $access = ( $row['accessible'] );
    
            $valuesArr[] = "('$buildingName', '$floorNumber', '$node_id', '$feat_name', '$feat_id', '$x_cord', '$y_cord', '$access');";
        }
    
        $sql .= implode(',', $valuesArr);
    
        if ($connection->query($sql) === TRUE) {
            echo "Data Pushed to SamplePush  successfully \n";
        } 
        else {
            echo "Error pushing data to SamplePush: " . $connection->error;
        }
    
    }
 
//////////////////////////////////////////////////////////////////////////////
    //Future GET Code
 
    $building_info = $_GET['building_info'];
    $floor_name = $_GET['floor_info'];
    
    echo "building_info is: $building_info \n";
    echo "floor_name is: $floor_name \n";
    echo "starting query.";
/*   
    $getInfo = "SELECT feat_name, x_cord, y_cord from SamplePush where buildingName = '$building_info' and floorNumber = '$floor_name';";
    $query = mysqli_query($getInfo);
    //echo "'$query' \n";
    if ($row = mysqli_fetch_array($query)) {
        echo 'inside confirmed fetch array';
        $featName = $row['feat_name'];
        $xCord = $row['x_cord'];
        $yCord = $row['y_cord'];
        
        echo $featName;
        echo $xCord;
        echo $yCord;
        echo "Successful.";
    }
    else {
        echo "Unsuccessful.";  
    }
*/    
   

    $sql = "SELECT feat_name, x_cord, y_cord from SamplePush where buildingName = '$building_info' and floorNumber = '$floor_name';";
    
       $result = $connection->query($sql);
       if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                echo "Feature: " . $row["feat_name"]. " Coordinates: " . $row["x_cord"]. ", " . $row["y_cord"]. "\n";
            }
        } else {
            echo "0 results";
        }
        
    $connection->close();
    
    //// sprintf -- get rid of $ variables and use sprintf.
    /// Escape Values for ints and strings
    /// Write GET code in JS and PHP
?>

