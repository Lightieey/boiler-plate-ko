const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

// application/x-www-form-urllencoded �̷��� �� �����͸� �м��ؼ� ������ �� �ְ� ����
app.use(bodyParser.urlencoded({extended: true}));

// application/json Ÿ���� �м��ؼ� ������ �� �ְ� ����
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! Hi~~')
})

app.post('/register', (req, res) => {
    // ȸ�������Ҷ� �ʿ��� �������� client���� ��������
    // �װ͵��� ������ ���̽��� �־���

    const user = new User(req.body) // bodyParser�� client���� ������ ������ �޾���
    user.save((err, userInfo) => {  // mongoDB���� ���� �޼ҵ�, �������� �����𵨿� �����
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})