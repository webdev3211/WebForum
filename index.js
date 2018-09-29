var express      =require('express');
var bodyParser   =require('body-parser');
var userRoutes   =require('./routes/users');
var mongoose     =require('mongoose');
//Setting Up Database
mongoose.connect("mongodb://humblefool:pankaj123@ds151951.mlab.com:51951/users",
{ useNewUrlParser: true },(err)=>{
    if(err) console.log("Error in Db connection");
    else    console.log("Connected to DataBase");
}
);
mongoose.Promise = global.Promise;

//Setting Up the App
var app=express();
//Setting up bodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Setting up Routers
app.use('/users',userRoutes);


//Listen to port
app.listen(8080,(err)=>{
    if(err) console.log("Error Occured During Listening Port");
    else    console.log(`Listening to port 8080`);
})

