const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const dburl = "mongodb+srv://h0ch1:a02070203@nodetest.kijps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// app 설정
app.use(express.urlencoded({extended: true}));
app.set('view engine' , 'ejs');


// DB & Server
var db
MongoClient.connect(dburl, (err, client) => {
    if(err) return console.log(err);

    db = client.db('todoapp');

    app.listen(8080, () => {
        console.log('server start');
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname+'/write.html');
});

app.post('/add', (req, res) => {
    res.send('전송완료');
    db.collection('counter').findOne('')
    db.collection('post').insertOne({제목 : req.body.title, 날짜 : req.body.date}, (err, result)=>{
        if(err) return console.log(err);
        console.log('저장완료');
    });
});



app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) =>{
        if(err) return console.log(err);
        console.log(result);
        res.render('list.ejs', {posts : result});
    });
});