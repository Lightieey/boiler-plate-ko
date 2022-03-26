const mongoose = require('mongoose');

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
    passwd: {
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

const User = mongoose.model('User', userSchema)

module.exports = { User }