const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please fill a valid phone number'] // Assuming phone numbers are 10 digits
  },
  checkin: {
    type: Date,
    required: [true, 'Check-in date is required'],
    validate: {
      validator: v => v >= new Date().setHours(0, 0, 0, 0),
      message: props => `Check-in date (${props.value}) cannot be in the past!`
    }
  },
  checkout: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(v) {
        return v > this.checkin;
      },
      message: props => `Check-out date (${props.value}) must be after check-in date!`
    }
  },
  requests: {
    type: String,
    trim: true
  },
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
}, {
  timestamps: true
});

// Add an index to improve query performance on frequently queried fields
bookingSchema.index({ listing: 1, user: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
