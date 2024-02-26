
require("dotenv").config({ path: __dirname + "/.env" });
const express = require('express');
const app = express();
const bcrypt = require("bcryptjs");
const pool = require("./database");
var cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/signup', async (req, res) => {
  let str = req.url;
  str = str.substring(2)

  var partsArray = str.split('&');
  var usernameStr = partsArray[0].split('=');
  var passwordStr = partsArray[1].split('=');
  var username = usernameStr[1];
  var password = passwordStr[1];

  const salt = await bcrypt.genSalt(10) ;

  try{
    const result1 = await pool.query('SELECT count(*) FROM users WHERE user_name = $1 GROUP BY user_id',[username]);
    if(result1.rowCount!=0) 
    {
      const result2 = await pool.query('SELECT user_password FROM users WHERE user_name = $1',[username]);
      return res.status(400).json({errors: [{msg: "Username Already Taken"}] });
    }
    else  
    {
      if(password.length>=5)
      {
        const result3 = await pool.query('INSERT INTO users (user_name, user_password) VALUES ($1  ,$2 )', [ username, await bcrypt.hash(password, salt)]);
      }
      else
      {
        return res.status(400).json({errors: [{msg: "Password is too short must be at least length 5"}] });
      }
    }
  }
  catch{
    res.status(500).send("Server error.");
  }
  res.json({response: "ok"});
})


app.get('/login', async (req, res) => {
  let str = req.url;
  str = str.substring(2)
  var partsArray = str.split('&');
  var usernameStr = partsArray[0].split('=');
  var passwordStr = partsArray[1].split('=');
  var username = usernameStr[1];
  var password = passwordStr[1];

  try{
    const result1 = await pool.query('SELECT user_id FROM users WHERE user_name = $1',[username]);
    if(result1.rowCount!=0)
    {
      const result2 = await pool.query('SELECT user_password FROM users WHERE user_name = $1',[username]);
      var pw = result2.rows[0].user_password

      if(await bcrypt.compare(password, pw))
      {
        console.log("Login Success")         
      }
      else
      {
        return res.status(400).json({errors: [{msg: "Incorrect Password or Account Name"}] });
      }
    }
    else 
    {
      return res.status(400).json({errors: [{msg: "Account does not exist"}] });
    }
  }
  catch{
    res.status(500).send("Server error.");
  }
  res.json({response: "ok"});
})

const server = app.listen(PORT, () => {
    console.log(`Server listening on the port  ${PORT}`);
})

module.exports = {
  server,
  app
}