var mongoose = require('mongoose');
var commentSchema=mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     text:{
         type:String,
         required:true
     },
     createdAt:{
         type:Date,
         default:Date.now
     }
});

var postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
  createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    likes: {
        type: Number,
        default: 0
    },

    dislikes: {
        type: Number,
        default: 0
    },

    // likedBy: { 
    //     type: Array
    // },

    // dislikedBy: { 
    //     type: Array 
    // },

    createdAt:{
        type:Date,
        default: Date.now
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    comments:[commentSchema]

});

module.exports = mongoose.model('Post', postSchema);


