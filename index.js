const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

// application/x-www-form-urllencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입을 분석해서 가져올 수 있게 해줌
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
    // 회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어줌

    const user = new User(req.body) // bodyParser로 client에서 보내는 정보를 받아줌
    user.save((err, userInfo) => {  // mongoDB에서 오는 메소드, 정보들이 유저모델에 저장됨
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})