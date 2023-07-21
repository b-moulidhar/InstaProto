const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const multer  = require('multer');
const fs      = require('fs');
const config = require("./lib/config.json");
const errorHandler = require("./lib/utils").errorHandler;

const port = 5000;
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded files
    }
  });
  
  const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: '20.127.252.227',
  user: 'hypervision',
  password: 'hypervisor@2001',
  database: 'dhanushdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Establish the MySQL connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  // You have successfully connected to the database
  console.log('Connected to MySQL database!');

  // Release the connection back to the pool after use
  connection.release();
});

app.use(express.static(__dirname + "/public"))
  .use(express.json())
  .use(cors());
//----------------------------------------------------------------------------------------------------------------------
// READ
app.get("/data", (req, res) => {
  pool.query("SELECT * FROM table1", (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }

    return res.json(results);
  });
});

//------------------------------------------------------------------------------------------------------------

app.get("/getImages", (req, res) => {
  const query = 'SELECT * FROM files';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching PDF blob data from MySQL' });
    }

    // Create an array to store the file data
    const fileDataArray = [];

    // Iterate through the query results and push each file data to the array
    results.forEach(result => {
      const blobName = result.filename;
      const blobType = result.filetype;
      const blobData = result.filedata.toString('binary');
      fileDataArray.push({ filename: blobName, filetype: blobType, filedata: blobData });
    });

    // Send the file data as a response
    res.writeHead(200, {
      'Content-Type': 'application/json', // Use application/json content type for sending JSON data
    });
    res.end(JSON.stringify(fileDataArray)); // Convert the array to JSON and send it as the response
  });
});

//-----------------------------------------------------------------------------------------------------------------------

app.post('/create', (req, res) => {
    const { name, age } = req.body;
  
    const query = 'INSERT INTO table1 (name, age) VALUES (?, ?)';
  
    pool.query(query, [name, age], (err, result) => {
      if (err) {
        console.error('Error inserting new element:', err);
        res.status(500).json({ error: 'Error inserting new element' });
      } else {
        console.log('New element inserted successfully:', result.insertId);
        res.status(201).json({ message: 'New element inserted successfully' });
      }
    });
  });

//----------------------------------------------------------------------------------------------------------------------

  app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
  
    // Convert the file to binary data
    const fileBuffer = fs.readFileSync(file.path);
    const fileData = fileBuffer.toString('base64');
  
    // Insert the file data into the database
    const query = 'INSERT INTO files (filename, filetype, filedata) VALUES (?, ?, ?)';
    pool.query(query, [file.filename, file.mimetype, fileData], (err, result) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }
  
      res.json({ message: 'File uploaded successfully' });
    });
  });

//-----------------------------------------------------------------------------------------------------------------

  app.post("/comments/:hid",(req,res)=>{

  })

//-------------------------------------------------------------------------------------------------------------------

// Start the server
app.listen(port, config.host, errorHandler);
console.log(`Server is now ready on ${config.host}:${port}`);
