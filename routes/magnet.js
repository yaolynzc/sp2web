const mongoose = require('mongoose')
const Schema = mongoose.Schema

var MagnetSchema = new Schema({
    infohash: { type: String, required: true },
    name: String,
    type: String,
    size: {
      type: Number,
      default: 0
    },
    subList: [{
      _id: false,
      name: { type: String },
      size: { type: Number, default: 0 }
    }],
    hot: {
      type: Number,
      default: 1
    },
    hots: [{
      _id: false,
      date: { type: Date },
      // 热度值
      val: { type: Number, default: 1 }
    }],
    disable: { type: Boolean, default: false },
    meta: {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    }
  })

MagnetSchema = mongoose.model('Magnet', MagnetSchema)
module.exports = MagnetSchema