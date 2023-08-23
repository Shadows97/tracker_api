const http = require('http')
const express = require("express");
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {updateStatus, updateLocation} = require('./controllers/delivery.controller');

app.use(cors())

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

io.on('connection', socket => {

  console.log('new connection'); 
  
  socket.on('update_delivery', async (data) => { 
    try {
      let updatedDelivery;
      if(data.event_type == 'status_changed'){
        updatedDelivery = await updateStatus(data.delivery_id, data.status);
      } else if (data.event_type == 'location_changed'){
        updatedDelivery = await updateLocation(data.delivery_id, data.location);
      }

      if (updatedDelivery) {
        
        io.emit('delivery_updated', {
          event: data.event_type,
          delivery_object: updatedDelivery,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  });

})


server.listen(process.env.PORT, () => {
    console.log(`Server Start on Port ${process.env.PORT}`)
});
  