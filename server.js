const express = require('express');
const app = express();

// body-parser
app.use(express.urlencoded({extended: true}));

app.listen(8080, () => {
    console.log('server start');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/write', (req, res) => {
    res.sendFile(__dirname+'/write.html');
});

app.post('/add', (req, res) => {
    res.send('전송완료');
    console.log(req.body.title);
    console.log(req.body.date);
});