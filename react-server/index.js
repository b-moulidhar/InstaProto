const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const multer  = require('multer');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
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
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'localschema',
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
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  const uid = req.header('User-Id')

  if (!token && !uid) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// READ
app.get("/data", verifyToken ,(req, res) => {
  pool.query("SELECT * FROM images", (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }

    return res.json(results);
  });
});

//------------------------------------------------------------------------------------------------------------

app.get('/login',(req,res)=>{
  pool.query("SELECT email FROM users", (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }
    console.log(results);
    return res.json(results);
  });
})
//------------------------------------------------------------------------------------------------------------

app.post("/login", (req, res) => {
  const { email, pswd } = req.body;
  console.log(req.body);

  // Fetch user from database based on email
  pool.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error fetching data from MySQL" });
    }

    const users = results;
    console.log(users);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log(users[0].u_pswd);
    console.log(pswd)
    // Compare password with hashed password in the database
    bcrypt.compare(pswd, users[0].u_pswd, (err, isPasswordValid) => {
      if (err) {
        console.error("Error comparing password:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // If the user is authenticated, create a JWT
      const payload = { id: users[0].id, email: users[0].email };
      const token = jwt.sign(payload, "your-secret-key", { expiresIn: "1h" });
      res.setHeader("User-Id", users[0].id);

      return res.status(200).json({ message: "Login successful", token });
    });
  });
});


//------------------------------------------------------------------------------------------------------------

app.post('/register',(req,res)=>{
  var { name, email , mobile, pswd } = req.body;
  bcrypt.hash(pswd, 2, (err, u_pswd) => {
    if (err) {
      console.error('Error hashing password:', err);
      return;
    }
   

    let id = Math.random()*10000
    const query = "insert into users (id, u_name, email, mobile, u_pswd) VALUES (?, ?, ?, ?, ?)"
      pool.query(query, [id,name, email, mobile, u_pswd], (err, result) => {
        if (err) {
          console.error('Error inserting new element:', err);
          res.status(500).json({ error: 'Error inserting new element' });
        } else {
          console.log('New element inserted successfully:', result.insertId);
          res.status(201).json({ message: 'New element inserted successfully' });
        }
      });
  });
 
  
  });

//------------------------------------------------------------------------------------------------------------
app.get("/getImages", (req, res) => {
  const query = 'SELECT * FROM images';

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
    const uid = req.headers("User-Id")
    let id = Math.random()*1000
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    } 
  
    // Convert the file to binary data
    const fileBuffer = fs.readFileSync(file.path);
    const fileData = fileBuffer.toString('base64');
  
    // Insert the file data into the database
    const query = 'INSERT INTO files (id, userid, filename, filetype,filedata) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, [id, uid,file.filename, file.mimetype, fileData], (err, result) => {
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
