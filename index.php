<?php
// Database connection details
$hostname = 'kingkong.mysql.database.azure.com';  // Your Azure MySQL server hostname
$username = 'realolihasan';  // Your Azure MySQL username
$password = 'Md954146';  // Your Azure MySQL password
$dbname = 'mywebdatabase';  // Your database name

// Create connection
$conn = new mysqli($hostname, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch data from 'users' table
$sql = "SELECT id, name, email FROM users";
$result = $conn->query($sql);

// Display data in an HTML table
if ($result->num_rows > 0) {
    echo "<table border='1'>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
            </tr>";
    while($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row["id"] . "</td>
                <td>" . $row["name"] . "</td>
                <td>" . $row["email"] . "</td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "0 results";
}

// Close connection
$conn->close();
?>
