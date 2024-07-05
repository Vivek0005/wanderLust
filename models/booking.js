const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  checkin: {
    type: Date,
    required: true
  },
  checkout: {
    type: Date,
    required: true
  },
  requests: String,
  listing: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
