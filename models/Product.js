const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Body', 'Other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    carMake: {
      type: String,
      required: [true, 'Car make is required'],
    },
    carModel: {
      type: String,
      required: [true, 'Car model is required'],
    },
    carYear: {
      type: Number,
      required: [true, 'Car year is required'],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String, // stores the filename/path of the uploaded image
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
