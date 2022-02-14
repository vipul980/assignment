const express = require('express');
const { connect } = require("mongoose");
const http = require("http");
const { mongoURI } = require("./config/keys");
const {PORT} = require("./config/keys")

const app = express();

const meetingRoutes = require('./routes/meeting');

const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
  
    if (port >= 0) {
      return port;
    }
  
    return false;
  };

const startApp = async () => {

    app.all("/*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization,sentry-trace"
        );
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
        next();
      });

    app.use('/api/meeting', meetingRoutes);

    const server = http.createServer(app);

    const port = normalizePort(PORT);
    app.set("port", port);

    server.listen(port, () => { console.log(`Server started on port ${PORT}`)})

    await connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then(() => {
            console.log("Connected to the database")
        })
        .catch(() => {
        console.log("failed to connect with database")
        process.exit();
        });
    

}

startApp();
