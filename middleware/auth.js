const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리 하는 곳

    // 클라이언트에서 토큰 가져오기
    let token = req.cookies.x_auth;

    // 토큰 복호화 후 유저 찾기
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        req.token = token;
        req.user = user;
        next(); // middleware 다음으로 갈 수 있게
    })
    // 유저가 있으면 인증 ok

    // 유저가 없으면 인증 no
}

module.exports = { auth };