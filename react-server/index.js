const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const multer  = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");
const fs      = require('fs');
// const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator')
const config = require("./lib/config.json");
// const { Auth, LoginCredentials } = require("two-step-auth");
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

//*********************************************************************************************************
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

//*********************************************************************************************************
const sendOtpMail = async function(emails,req,res){
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.adminEmail,
      pass: config.pswd
    }
  });
  let otp = otpGenrator(emails);

  try {
    const result = await transporter.sendMail({
      from: config.adminEmail,
      to: emails,
      subject: 'OTP',
      text: `OTP is ${otp}`
    });
    console.log("Email sent:", result.response);
    res.status(250).json('OTP sent successfully' );

  } catch (err) {
    console.error("Error sending email:", err);
  }
}
//*********************************************************************************************************
const verifyOtpMail = async function(data,otp,res){
  const enteredOTP = otp; // The OTP entered by the user
  var storedOTP = otpStorage[data]; // otpStorage is an object that stores OTPs
  console.log(storedOTP)
  console.log(storedOTP == enteredOTP);
  if (storedOTP == enteredOTP) {
    // OTP is verified successfully
    console.log('otpStorage before deletion:', otpStorage)
    delete otpStorage[data]; // Remove the OTP from storage to prevent replay attacks
     res.json({ message: 'OTP verified successfully' });
  } else {
    // Invalid OTP
    res.status(401).json({ error: 'Invalid OTP' });
  }
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// READ
app.get("/data", verifyToken ,(req, res) => {
  const query = "SELECT id,u_name,email,mobile,profilepic from users";
  pool.query(query, (err, result) => {
    console.log(result);
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }
    const fileDataArray=[];
     var blobData;
     result.forEach((userdata,idx)=>{
       if(userdata.profilepic==null){
         blobData=null;
       }else{
         blobData = (userdata.profilepic).toString('binary');
       }
       if(blobData || blobData==null){
         fileDataArray.push({ id:userdata.id, u_name:userdata.u_name , email:userdata.email, mobile:userdata.mobile, profilepic:blobData })
       }
      })
      if(fileDataArray.length>0){
        return res.json(fileDataArray);
      }
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

    let id = Math.ceil(Math.random()*100000);
    const query = "insert into users (id, u_name, email, mobile, u_pswd,profilepic) VALUES (?, ?, ?, ?, ?,?)"
      pool.query(query, [id,name, email, mobile, u_pswd,null], (err, result) => {
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
  let id = Math.ceil(Math.random() * 10000);

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
  let otp = otpGenrator(phoneNumber);

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
  var data
  console.log(req.body);
  if(!req.body.phno){
    data = req.body.email
  }else{
    data = req.body.phno
  }

  // const phoneNumber = req.body.phoneNumber; // The phone number to which OTP was sent
  const enteredOTP = req.body.Otp; // The OTP entered by the user
  // const enteredEmail = req.body.email; 
  verifyOtpMail(data,enteredOTP,res);

});
//-------------------------------------------------------------------------------------------------------------------
app.post("/updatepass",(req,res)=>{
const {npass,contact} = req.body;
console.log("update pass")
console.log(req.body)
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|in|edu|co)$/i;
const phnumPattern = /^[6-9]\d{9}$/;
bcrypt.hash(npass, 2, (err, u_pswd) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  let query;
  if(emailPattern.test(contact)){
     query = "UPDATE users SET u_pswd = ? WHERE email = ?" 
  }else if(phnumPattern.test(contact)){
    query = "UPDATE users SET u_pswd = ? WHERE mobile = ?" 
  }
  if(query){
    pool.query(query,[u_pswd,contact],(err,result)=>{
      console.log(result,"hello"+contact);
      if(result.changedRows==0){
        console.error('Error updating file:', err);
            return res.status(500).json({ error: 'Error updating file' });
      }
      res.json({message:"password updated successfully"})
    })
  }
  
})


})

//-------------------------------------------------------------------------------------------------------------------

app.post("/sendEmail", async (req, res)=> {
    const emails = req.body.email;
    pool.query("SELECT email FROM users WHERE email = ?", [emails], async (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: "Error fetching data from MySQL" });
      }

      const users = results;
      if(users[0] == undefined){
        console.log("user does not exist ");
        res.json("user does not exist")
      }else{

        if (users[0].email == emails) {

          sendOtpMail(emails,req,res)
        } else {
          console.log("user does not exist");
        }
      }
    });

  })

//-------------------------------------------------------------------------------------------------------------------

app.get('/profileDetails/:id',verifyToken,(req,res)=>{
  const uid = req.params.id;
  const query = "SELECT id,u_name,email,mobile,profilepic from users where id = ?"
  pool.query(query,[uid],(err,result)=>{
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data from MySQL' });
    }
    // console.log(result)
    const fileDataArray=[];
     var blobData;
    if(result[0].profilepic==null){
      blobData=null;
    }else{
      blobData = result[0].profilepic.toString('binary');
    }
    if(blobData || blobData==null){
      fileDataArray.push({ id:result[0].id, u_name:result[0].u_name , email:result[0].email, mobile:result[0].mobile, profilepic:blobData })
    }
    if(fileDataArray.length>0){
      return res.json(fileDataArray);
    }
  })
})

//-------------------------------------------------------------------------------------------------------------------

app.post('/profilePicUpload', [upload.single('file'), verifyToken], (req, res) => {
  const file = req.file;
  const uid = req.headers.userid;
  let id = Math.ceil(Math.random() * 100000);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Convert the file to binary data
  const fileBuffer = fs.readFileSync(file.path);
  const fileData = fileBuffer.toString('base64');

  // Insert the file data into the database
  const query = "UPDATE users SET profilepic = ? WHERE id = ?"
  const result = (file.filename).replace(/-.*/, '');
  pool.query(query, [fileData,uid], (err, result) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
    fs.unlinkSync(file.path);
    
    res.json({ message: 'File uploaded successfully' });
  });
});
//-------------------------------------------------------------------------------------------------------------------
app.delete("/profilepicDelete",verifyToken, (req,res)=>{
  const uid = req.headers.userid;
  let queries = "UPDATE users SET profilepic = ? WHERE id = ?"
  pool.query(queries,[null,uid],(err,results)=>{
    if (err) {
      console.error('Error deleting element:', err);
      res.status(500).json({ error: 'Error deleting element' });
    } else {
      res.status(200).json({ message: 'Deleted successfully' });
    }
  })
})
//-------------------------------------------------------------------------------------------------------------------
app.get("/getLikes",verifyToken,(req,res)=>{
  const queries = "select * from likes"
  pool.query(queries,(err,result)=>{
    if(err){
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    return res.json(result);
  })
})
//-------------------------------------------------------------------------------------------------------------------
app.post("/postLikes", verifyToken, (req, res) => {
  const uid = req.headers.userid;
  const imgId = req.body.imageId;
  const id = Math.ceil(Math.random() * 1000000000);

  // Step 1: Check if the combination of u_id and image_id already exists
  const querySelect = "SELECT u_id, image_id FROM likes WHERE u_id = ? AND image_id = ?";
  pool.query(querySelect, [uid, imgId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }

    // Step 2: Check the query result
    if (results.length === 0) {
      // The combination does not exist, so insert the new like
      const insertQuery = "INSERT INTO likes (id, u_id, image_id) VALUES (?, ?, ?)";
      pool.query(insertQuery, [id, uid, imgId], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error executing query:', insertErr);
          return res.status(500).json({ error: 'Error inserting data' });
        }
        return res.json(insertResult);
      });
    } else {
      // The combination already exists, return a message
      return res.status(201).json({ error: 'Already liked' });
    }
  });
});
//-------------------------------------------------------------------------------------------------------------------
app.delete("/unPostLikes/:imgId",verifyToken,(req,res)=>{
  const uid = req.headers.userid
  const imagId = req.params.imgId
  const queries = "DELETE FROM likes WHERE u_id = ? AND image_id = ?;"
  pool.query(queries,[uid,imagId],(err,result)=>{
    if(err){
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }
    return res.json(result);
  })
})
//-------------------------------------------------------------------------------------------------------------------
app.post("/profile/follow/:id",verifyToken,(req,res)=>{
    let profileId = req.params.id;
    let userId = req.body.userId;
    console.log(profileId,userId,"QEJAFWQFNQGF");
    let id = Math.ceil(Math.random()*100000);
    const insertQuery = "insert into followerssample (id, user_id, followers, followers_id) VALUES (?, ?, ?, ?)"
    pool.query("SELECT u_name from users where id = ?",[userId],(err,results)=>{
      if(err){
        return res.status(500).json({error:"error fetching the data"})
      }
      const user_name = results[0].u_name;
      console.log(id,userId,user_name,profileId);
      pool.query(insertQuery,[id,userId,user_name,profileId],(errs,results)=>{
        if(errs){
          if(errs.sqlState==23000){
            return res.status(500).json({error:"already followed"});
          }
          return res.status(500).json({error:"error inserting the data"})
        }
        res.json({success:"data added succesfully"});
      })
    })
})
//-------------------------------------------------------------------------------------------------------------------
app.post("/profile/following/:id",verifyToken,(req,res)=>{
    let profileId = req.params.id;
    let userId = req.body.userId;
    console.log(profileId,userId,"QEJAFWQFNQGF");
    let id = Math.ceil(Math.random()*100000);
    const insertQuery = "insert into followingsample (id, user_id, u_following, u_following_id) VALUES (?, ?, ?, ?)"
    pool.query("SELECT u_name from users where id = ?",[userId],(err,results)=>{
      if(err){
        return res.status(500).json({error:"error fetching the data"})
      }
      const user_name = results[0].u_name;
      console.log(id,userId,user_name,profileId);
      pool.query(insertQuery,[id,profileId,user_name,userId],(errs,results)=>{
        if(errs){
          if(errs.sqlState==23000){
            return res.status(500).json({error:"already followed"});
          }
          return res.status(500).json({error:"error inserting the data"})
        }
        res.json({success:"data added succesfully"});
      })
    })
})

//-------------------------------------------------------------------------------------------------------------------
app.get('/profile/followers/:id',verifyToken,(req,res)=>{
  let profId = req.params.id;
  query = "SELECT * FROM followerssample WHERE user_id = ?"
  pool.query(query,[profId],(err,results)=>{
    if(err){
      return res.status(500).json({error:"error fetching the data"})
    }
    console.log(results,"helloPost");
    return res.json(results);
  })
})
//-------------------------------------------------------------------------------------------------------------------
app.get('/profile/following/:id',verifyToken,(req,res)=>{
  let profId = req.params.id;
  query = "SELECT * FROM followingsample WHERE user_id = ?"
  pool.query(query,[profId],(err,results)=>{
    if(err){
      return res.status(500).json({error:"error fetching the data"})
    }
    console.log(results,"helloGet");
    return res.json(results);
  })
})

//-------------------------------------------------------------------------------------------------------------------
// Start the server
app.listen(port,errorHandler);
console.log(`Server is now ready on:${port}`);
