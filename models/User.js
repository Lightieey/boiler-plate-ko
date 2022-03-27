const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 입력에서 빈칸 없애줌
        unique: 1   // 같은 이메일 중복 사용 금지
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자 or 일반 사용자 역할.. -> 0이면 일반, 1이면 관리자 이런식으로?
        type: Number,
        default: 0
    },
    image: String,
    token: {    // 유효성 관리
        type: String
    },
    tokenExp: { // 토큰 유효기한
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) {   // password가 바뀔 때만 비밀번호 암호화
        // 비밀번호 암호화 (bcrypt)
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {    // password 말고 다른거 바꾸면 next()로 넘어가기
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword를 암호화해서 DB에 있는 암호화된 비밀번호랑 같은지 확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // token decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // decoded(user_id) 이용해서 유저 찾고
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema) // model로 schema 감싸기

module.exports = { User }