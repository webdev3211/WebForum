var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


var commentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    comment: {
        type: String,
        required: true
    },
    commentator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
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
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
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

    likedBy: {
        type: Array,
        // unique: true,
        sparse: true
    },

    dislikedBy: {
        type: Array,
        // unique: true,
        sparse: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    viewcount: {
        type: Number,
        default: 0
    },

    comments: [commentSchema]

});

postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', postSchema);