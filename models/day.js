let mongoose = require(`mongoose`);

let Schema = mongoose.Schema;


let Day = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  writes: [
    {
      create: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      smile: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      generate: Boolean,
      today: Boolean,
      noneText: Boolean,
      dayoff: String      
    }
  ],
  key: {
    type: Object,
    required: true
  }
})

/*
let Day = new Schema({
  create: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  smile: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  generate: Boolean,
  today: Boolean,
  noneText: Boolean,
  dayoff: String
})
*/

module.exports = mongoose.model(`Days`, Day);