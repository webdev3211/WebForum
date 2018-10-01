var mongoose =require('mongoose');

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
    createdAt:{
        type:Date,
        default: Date.now
    },
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
    // comments:[{
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Comment' 
    // }]

});
module.exports=mongoose.model('Post',postSchema);