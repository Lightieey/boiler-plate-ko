const mongoose = require('mongoose');

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
    passwd: {
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

const User = mongoose.model('User', userSchema)

module.exports = { User }