var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    tag: {
        _id: mongoose.Schema.Types.ObjectId, //_id ko comment krdo koi dikkat nai h 
        type: String,
        required: true,
        // ref: 'Post'
    },

    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tag', tagSchema);