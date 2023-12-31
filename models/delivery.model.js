const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  delivery_id: {
    type: String,
    required: true,
    unique: true
  },
  package_id: {
    type: String,
    required: true
  },
  pickup_time: {
    type: Date,
    required: false
  },
  start_time: {
    type: Date,
    required: false 
  },
  end_time: {
    type: Date,
    required: false 
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['open', 'picked-up', 'in-transit', 'delivered', 'failed'],
    required: true
  }
}, {timestamps: true});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
