const http = require('http')
const express = require("express");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

require("dotenv").config({ path: './.env'});

require('../tracker_api/config/database');

const  bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    req.io = io;
    return next();
  });

const packageRoutes = require('./routes/package.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const swaggerRoutes = require('./routes/swagger.routes');

app.use('/api', packageRoutes);
app.use('/api', deliveryRoutes);
app.use('/', swaggerRoutes);

server.listen(process.env.PORT, () => {
    console.log(`Server Start on Port ${process.env.PORT}`)
});
  