const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// application/x-www-form-urllencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! Hi~~')
})

app.post('/api/users/register', (req, res) => {

    // 회원가입할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어줌

    const user = new User(req.body) // bodyParser로 client에서 보내는 정보를 받아줌
    // 여기서 pre 부분 수행
    user.save((err, userInfo) => {  // mongoDB에서 오는 메소드, 정보들이 유저모델에 저장됨
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.post('/api/users/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 있는지 찾음
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false, 
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

        // 비밀번호까지 맞다면 토큰 생성
        user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);

          // 토큰 저장 -> 어디에? 쿠키, 로컬스토리지 등
          res.cookie("x_auth", user.token)
          .status(200)  // 성공했다는 표시
          .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 Ture라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,  // ===는 data type까지 검사(strict equal operator)
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""}, (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})