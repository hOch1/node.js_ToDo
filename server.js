const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();

const dburl = "mongodb+srv://h0ch1:a02070203@nodetest.kijps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// app 설정
app.use(express.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.use(session({secret : '비밀코드', reasve : true, saveUninitialized : false }));
app.use(passport.initialize());
app.use(passport.session());


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
    res.render('index.ejs');
});

app.get('/write', (req, res) => {
    res.render('write.ejs');
});

app.post('/add', (req, res) => {
    db.collection('counter').findOne({name : '게시물갯수'}, (err, result) => {
        var total_Post = result.totalPost;

        db.collection('post').insertOne({ _id : total_Post + 1, 제목 : req.body.title, 날짜 : req.body.date}, (err, result)=>{
            console.log('저장완료');
            db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1}}, (err, result) =>{
                if(err) return console.log(err);
                res.redirect('/list');
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


//삭제
app.delete('/delete', (req, res) => {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, (err, result) =>{
        console.log('삭제완료');
    })
})

//상세페이지
app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (err, result) =>{
        res.render('detail.ejs', { data : result});
    })
})


//수정
app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({ _id : parseInt(req.params.id)}, (err, result) => {
        res.render('edit.ejs', { data : result});
    })
})

app.put('/edit', (req, res) => {
    db.collection('post').updateOne({ _id : parseInt(req.body.id)},
    { $set : { 제목 : req.body.title, 날짜 : req.body.date}}, (err, result) => {
        res.redirect('/list');
    })
})