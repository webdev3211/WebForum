const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var userRoutes = require('./routes/users');
var postRoutes = require('./routes/posts');
var tagRoutes = require('./routes/tags');
var mongoose = require('mongoose');
var jsonwebtoken = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const socketIO = require('socket.io');

const http = require('http');
const path = require('path');
const querystring = require('querystring');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

var upload = multer({
    storage: storage
})
app.post('/upload', upload.single('image'), (req, res) => {
    console.log("req made");
    res.json(req.file);
});

//Setting Up Database
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://humblefool:pankaj123@ds151951.mlab.com:51951/users", {
    useNewUrlParser: true
}, (err) => {
    if (err) console.log("Error in Db connection");
    else console.log("Connected to DataBase");
});
mongoose.Promise = global.Promise;


app.use('/uploads', express.static('uploads/'));
app.use(cors({
    origin: 'http://localhost:4200'
}))

//Setting up bodyParser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//Setting up Routers
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/tags', tagRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/src/index.html'));
});

// const server = http.createServer(app);
// const io = socketIO(server);
// app.set('io', io);


//Listen to port
app.listen(8080, (err) => {
    if (err) console.log("Error Occured During Listening Port");
    else console.log(`WebForum Community is listening to port 8080`);
})