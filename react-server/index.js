const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const multer  = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const fs      = require('fs');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator')
const config = require("./lib/config.json");
const { Auth, LoginCredentials } = require("two-step-auth");
const errorHandler = require("./lib/utils").errorHandler;
const accountSid = config.accountSid;
const authToken = config.authToken;
const twilioPhoneNumber = config.twilioPhoneNumber;
const twilioClient  = require('twilio')(accountSid, authToken);


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
  host: config.dbhost,
  user: config.user,
  password: config.pass,
  database: config.dbname,
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
  const token = req.headers.authorization;
  const uid = req.headers.userid
  if (!token && !uid) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token.split(" ")[1], "your-secret-key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.log(decoded)
    req.user = decoded;
    next();
  });
};

const otpStorage = {};

const otpGenrator = (data)=>{

  // Generate a 6-digit OTP
    const otp = otpGenerator.generate(6, { 
      alphabets: false ,       // Exclude alphabetic characters
      upperCase: false,       // Exclude uppercase letters
      specialChars: false    // Exclude special characters
    });
    
  otpStorage[data] = otp;
  return otp;

}


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
      const token = jwt.sign(payload, "your-secret-key", { expiresIn: "1000s" });
      const user = users[0].id;
      // res.setHeader("UserId", users[0].id);
      // res.setHeader("Authorization", users[0].id);

      return res.status(200).json({ message: "Login successful", token , user});
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
app.get("/getImages",verifyToken, (req, res) => {
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
      fileDataArray.push({ id:result.id , uid: result.user_id, filename: blobName, filetype: blobType, filedata: blobData });
    });

    // Send the file data as a response
    res.writeHead(200, {
      'Content-Type': 'application/json', // Use application/json content type for sending JSON data
    });
    res.end(JSON.stringify(fileDataArray)); // Convert the array to JSON and send it as the response
  });
});
//-----------------------------------------------------------------------------------------------------------------------

app.delete("/deleteUsrUpload",verifyToken, (req,res)=>{
  const imgId = req.headers.imgid;
  let queries = "DELETE FROM images WHERE id = ?"
  pool.query(queries,[imgId],(err,results)=>{
    if (err) {
      console.error('Error deleting element:', err);
      res.status(500).json({ error: 'Error deleting element' });
    } else {
      console.log('Deleted successfully',results);
      res.status(200).json({ message: 'Deleted successfully' });
    }
  })
})

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

app.post('/upload', [upload.single('file'), verifyToken], (req, res) => {
  const file = req.file;
  const uid = req.headers.userid;
  let id = Math.random() * 1000;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Convert the file to binary data
  const fileBuffer = fs.readFileSync(file.path);
  const fileData = fileBuffer.toString('base64');

  // Insert the file data into the database
  const query = 'INSERT INTO images (id, user_id, filename, filetype, filedata) VALUES (?, ?, ?, ?, ?)';
  const result = (file.filename).replace(/-.*/, '');
  pool.query(query, [id, uid, result, file.mimetype, fileData], (err, result) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    fs.unlinkSync(file.path);
    
    res.json({ message: 'File uploaded successfully' });
  });
});

//-----------------------------------------------------------------------------------------------------------------

  app.post("/comments",verifyToken,(req,res)=>{

    const { image_id, cmts} = req.body;
    const id = Math.ceil(Math.random()*10000);
    const uid = req.headers.userid;
    console.log(req.body);

    const query = 'INSERT INTO comments (id, user_id, image_id, u_comment) VALUES (?, ?, ?, ?)';
  pool.query(query, [id, uid, image_id, cmts], (err, result) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    res.json({ message: 'File uploaded successfully' });
  });
});

//-------------------------------------------------------------------------------------------------------------------

app.delete("/comments", verifyToken, (req,res)=>{
      const cmtId = req.headers.commentid;
      console.log(cmtId)
      const query = "DELETE FROM comments where id=?"
      pool.query(query,[cmtId],(err,results)=>{
        if (err) {
          console.error('Error Deleting file:', err);
          return res.status(500).json({ error: 'Error uploading file' });
        }
    
        res.json({ message: 'Comment Deleted successfully' });
      })
})
//-------------------------------------------------------------------------------------------------------------------
app.get("/comments", verifyToken ,(req, res) => {
  pool.query("SELECT * FROM comments", (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }

    return res.json(results);
  });
});

//-------------------------------------------------------------------------------------------------------------------
app.post('/generateOTP',(req, res) => {
  const phoneNumber = req.body.phoneNumber; // The phone number to which OTP will be sent
  console.log(req.body)

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is missing' });
  }

  // Generate a 6-digit OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
  otpStorage[phoneNumber] = otp;

  // Create a promise for sending OTP via Twilio
  const sendOTPPromise = new Promise((resolve, reject) => {
    twilioClient.messages
      .create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: `+91${phoneNumber}`, // Assuming the phone number is in India with country code +91
      })
      .then((message) => {
        console.log(`OTP sent to ${message.to}: ${otp}`);
        resolve();
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        reject(error);
      });
  });

  // Wait for the Twilio client to send the OTP before responding to the client
  sendOTPPromise
    .then(() => {
      res.json({ message: 'OTP sent successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error sending OTP' });
    });
});
//-------------------------------------------------------------------------------------------------------------------
// Assuming you already have the required dependencies and Twilio setup

app.post('/verifyOTP', (req, res) => {
  const phoneNumber = req.body.phoneNumber; // The phone number to which OTP was sent
  const enteredOTP = req.body.otp; // The OTP entered by the user

  // Here, you should have a mechanism to store the OTP sent to the user when you sent it.
  // For simplicity, let's assume you have a global object that stores OTPs for each phone number.
  // In a real-world scenario, you might use a database or cache to store OTPs.

  // Check if the entered OTP matches the one sent to the user
  const storedOTP = otpStorage[phoneNumber]; // otpStorage is an object that stores OTPs

  if (storedOTP == enteredOTP) {
    // OTP is verified successfully
    console.log('otpStorage before deletion:', otpStorage)
    delete otpStorage[phoneNumber]; // Remove the OTP from storage to prevent replay attacks
    res.json({ message: 'OTP verified successfully' });
  } else {
    // Invalid OTP
    res.status(401).json({ error: 'Invalid OTP' });
  }
});
//-------------------------------------------------------------------------------------------------------------------
app.post("/updatepass",(req,res)=>{
const {npass,phno} = req.body;

bcrypt.hash(npass, 2, (err, u_pswd) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  const query = "UPDATE users SET u_pswd = ? WHERE mobile = ?" 
  pool.query(query,[u_pswd,phno],(err,result)=>{
    console.log(result,"hello"+phno);
    if(result.changedRows==0){
      console.error('Error updating file:', err);
          return res.status(500).json({ error: 'Error updating file' });
    }
    res.json({message:"password updated successfully"})
  })
})


})

//-------------------------------------------------------------------------------------------------------------------

app.post("/sendEmail", async (req, res)=> {
    const emails = req.body.email;
    console.log("clicked", emails);

    pool.query("SELECT email FROM users WHERE email = ?", [emails], async (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error fetching data from MySQL" });
      }

      const users = results;
      console.log(results[0])
      if(users[0] == undefined){
        console.log("user does not exist ");
        res.json("user does not exist")
      }else{

        if (users[0].email == emails) {
          try {
            const result = await transporter.sendMail({
              from: config.yahooEmail,
              to: emails,
              subject: 'OTP',
              text: `OTP is ${otp}`
            });
            console.log("Email sent:", result.response);
            res.status(250).json('OTP sent successfully' );
  
          } catch (err) {
            console.error("Error sending email:", err);
          }
        } else {
          console.log("user does not exist");
        }
      }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.adminEmail,
        pass: "kmtgppxjbarncwyp"
      }
    });
    let otp = otpGenrator(emails);
    // try {
    //   const result = await transporter.sendMail({
    //     from: config.yahooEmail,
    //     to: emails,
    //     subject: 'OTP',
    //     text: `OTP is ${otp}`
    //   });
    //   console.log("Email sent:", result.response);
    //   res.status(250).json({ message: 'OTP sent successfully' });
    // } catch (err) {
    //   console.error("Error sending email:", err);
    // }
  })
//-------------------------------------------------------------------------------------------------------------------
// app.post("/verifyEmail",async (req,res)=>{
//   try {
//     const res = await Auth("moulivijay999@gmail.com", "Company Name");
//     console.log(res);
//     console.log(res.mail);
//     console.log(res.OTP);
//     console.log(res.success);
//   } catch (error) {
//     console.log(error);
//   }


//   // This should have less secure apps enabled
//   LoginCredentials.mailID = config.adminEmail; 
    
//   // You can store them in your env variables and
//   // access them, it will work fine
//   LoginCredentials.password = config.adminPass; 
//   LoginCredentials.use = true;
    
//   // Pass in the mail ID you need to verify
//   // login("moulivijay999@gmail.com");
// }
  
// )

//-------------------------------------------------------------------------------------------------------------------

// Start the server
app.listen(port,errorHandler);
console.log(`Server is now ready on:${port}`);
