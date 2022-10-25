const mongoose = require('mongoose');
const bookSchema=new mongoose.Schema({
  bookName:{
    type:String,
    required:true,
    unique:true
  },
  authorName:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
year:{
    type:Number,
    required:true
}
})
//bookSchema with bookName, authorName, category and year .

module.exports = mongoose.model('Bookdata', bookSchema) //user