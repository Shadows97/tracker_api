const swaggerAutogen = require('swagger-autogen')();
require("dotenv").config({ path: './.env'});

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ['http'],
  definitions: {
    "PackageInput": {
      "package_id": "string",
      "active_delivery_id": "string",
      "description": "string",
      "weight": "integer",
      "width": "integer",
      "height": "integer",
      "depth": "integer",
      "from_name": "string",
      "from_address": "string",
      "from_location": {
        "lat": "number",
        "lng": "number"
      },
      "to_name": "string",
      "to_address": "string",
      "to_location": {
        "lat": "number",
        "lng": "number"
      }
    },
    "DeliveryInput": {
      "delivery_id": "string",
      "package_id": "string",
      "pickup_time": "string",
      "start_time": "string",
      "end_time": "string",
      "location": {
        "lat": "number",
        "lng": "number"
      },
      "status": {
        "enum": ["open", "picked-up", "in-transit", "delivered", "failed"]
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);