var express = require('express');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/users');
var postRoutes =require('./routes/posts');
var tagRoutes =require('./routes/tags');
var mongoose = require('mongoose');
var jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');

//Setting Up Database
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://humblefool:pankaj123@ds151951.mlab.com:51951/users", {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log("Error in Db connection");
    else console.log("Connected to DataBase");
});
mongoose.Promise = global.Promise;

//Setting Up the App
var app = express();
//Setting up bodyParser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//Setting up Routers
app.use('/users', userRoutes);
app.use('/posts',postRoutes);
app.use('/tags',tagRoutes);


//Listen to port
app.listen(8080, (err) => {
    if (err) console.log("Error Occured During Listening Port");
    else console.log(`WebForum Community is listening to port 8080`);
})