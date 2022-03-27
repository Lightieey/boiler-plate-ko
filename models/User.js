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
        trim: true, // �Է¿��� ��ĭ ������
        unique: 1   // ���� �̸��� �ߺ� ��� ����
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // ������ or �Ϲ� ����� ����.. -> 0�̸� �Ϲ�, 1�̸� ������ �̷�������?
        type: Number,
        default: 0
    },
    image: String,
    token: {    // ��ȿ�� ����
        type: String
    },
    tokenExp: { // ��ū ��ȿ����
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) {   // password�� �ٲ� ���� ��й�ȣ ��ȣȭ
        // ��й�ȣ ��ȣȭ (bcrypt)
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {    // password ���� �ٸ��� �ٲٸ� next()�� �Ѿ��
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword�� ��ȣȭ�ؼ� DB�� �ִ� ��ȣȭ�� ��й�ȣ�� ������ Ȯ��
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken�� �̿��ؼ� token ����
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
        // decoded(user_id) �̿��ؼ� ���� ã��
        // Ŭ���̾�Ʈ���� ������ token�� DB�� ������ token�� ��ġ�ϴ��� Ȯ��

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema) // model�� schema ���α�

module.exports = { User }