require("dotenv").config()
const path = require('path');
const express = require('express');
const app = express()
app.use('/images', express.static(path.resolve(__dirname,'images')))
// const db = require("./config/database")
const {authRouter} = require('../routes/route')
const bodyParser = require('body-parser');
// const regR = require('./routes/auth')
app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.raw());
    app.use(require("cors")())

    app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      next();
  });


  app.use(authRouter)
  // Add this at the end of your route configuration




const PORT = process.env.PORT



app.listen(PORT, () => {
  console.log(`server listening at port:${PORT}`);
});

//test db
// db.authenticate().then(()=>console.log('database connected')).catch(err=>console.log('Error:'+err))
