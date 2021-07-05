/*
*
*
*       Complete the API routing below
*       
*       
*/
require('dotenv').config();
const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const Schema = mongoose.Schema;

const db = mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true})

const BookSchema = new Schema({
  title: {type:String, required: true},
  comments: [String],
  commentcount: {type: Number, default:0}
},{ versionKey: false })

let Book = mongoose.model("Book", BookSchema);

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      Book.find((err, books) =>{
        if(err){ 
          return res.send({error: "Error"})
        }else{
          res.json(books)
        }
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let newtitle = req.body.title;
      let bookid = req.body._id;
      let newBook = new Book({
        title: newtitle
      })
      newBook.save((err, book) =>{
        if(err){
          return res.send("missing required field title")
        }else{
          res.json({
            _id: book._id,
            title: book.title
          })
        }
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, (err, book) =>{
        if(err){
          return res.send("failed to complete delete")
        }else{
          return res.send("complete delete successful")
        }
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if(!bookid){
        return res.send("missing required field id")
      }
        Book.findById(bookid, (err, book) =>{
        if(err || book === null){
          return res.send("no book exists")
        }else{
          //console.log(book)
          res.json(book)
        }
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //console.log(bookid)
      //console.log(comment)
      //json res format same as .get
      if(!bookid){
        return res.send("missing required field id")
      }
      if(!comment){
        return res.send("missing required field comment")
      }
      Book.findById(bookid, (err, book) =>{
        //console.log(book)
        if(err || book === null){
          return res.send("no book exists")
        }else{
          //console.log(book)
          book.comments.push(comment)
          book.commentcount += 1;
          book.save((err, ret) =>{
            if(err || ret === null){
              return res.send("no book exists")
            }else{
              res.json(ret)
            }
          })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if(!bookid){
        return res.send("missing required field id")
      }
      //console.log(bookid)
      Book.countDocuments({_id: bookid}, (err, s) =>{
        Book.findByIdAndRemove(bookid, (err, book)=>{
        if(err || book === null){
          return res.send("no book exists")
        }else{
          //console.log(book)
          return res.send("delete successful")
        }
      })
      })
    });
  
};
