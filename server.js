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
    db.collection('counter').findOne({name : '게시물갯수'}, (err, result) => {
        var total_Post = result.totalPost;

        db.collection('post').insertOne({ _id : total_Post + 1, 제목 : req.body.title, 날짜 : req.body.date}, (err, result)=>{
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1}}, (err, result) =>{
                if(err) return console.log(err);
                res.send('전송완료');
            });
        });
    });
});

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) =>{
        if(err) return console.log(err);
        console.log(result);
        res.render('list.ejs', {posts : result});
    });
});

app.delete('/delete', (req, res) => {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, (err, result) =>{
        if(err) return console.log(err);
        console.log('삭제완료');
    });
});