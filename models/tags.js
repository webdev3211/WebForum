var mongoose =require('mongoose');
var tagSchema=mongoose.Schema({
     tag:{  
         type: String,
         required:true
     }
});

module.exports= mongoose.model('tag',tagSchema);