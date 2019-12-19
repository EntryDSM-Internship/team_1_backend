const User = require('../../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'seungbin031206@gmail.com',
        pass: 'ysb031206'
    }
});

let emailCode = new Array(1, 2, 3, 4, 5, 6).join('');

//-------------------------------------------------------
// 닉네임 중복 확인

const existEmail = (req, res, next) => {
    const email = req.body.email;

    const check = (user) => {
        if (!user) {
            next();
        } else {    
            res.status(409).json({ message: 'email already exist' });
        }
    }

    const onError = (err) => {
        res.status(500).json(err);
    }

    User.findOneByEmail(email)
    .then(check)
    .catch(onError)
}

//-------------------------------------------------------
// 이메일 중복 확인

const existNick = (req, res, next) => {
    const nick = req.body.nick;

    const check = (user) => {
        if (!user) {
            res.status(200).json({ message: 'Available Email and Nickname'});
        } else {
            res.status(410).json({ message: 'nickname already exist' });
        }
    }

    const onError = (err) => {
        res.status(500).json(err);
    }

    User.findOneByNick(nick)
    .then(check)
    .catch(onError)
}

//-------------------------------------------------------
// 이메일 전송

const emailSend = (req, res, next) => {
    const email = req.body.email;

    let mailOption = {
        from: 'seungbin031206@gmail.com',
        to: email,
        subject: 'mailAuth',
        text: emailCode,
    }

    transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            res.json(err);
            console.error(err);
            next('error')
        } else {
            res.send('Email Sent!' + info.response);
        }
    });
}

//-------------------------------------------------------
// 인증코드 확인

const emailAuth = (req, res, next) => {
    const authNum = req.body.auth;
    if (authNum === emailCode) {
        res.status(200).json({ message: 'correct email auth code' });
    } else {
        res.status(403).json({ message: 'Authentication failed' });
    }
}

//-------------------------------------------------------
// 회원가입

const register = (req, res, next) => {
    const { name, nick, email, password } = req.body;

    const respond = (user) => {
        res.status(200).json(user);
    }

    const onError = (err) => {
        res.status(500).json({ message: err });
    }
    
    User.create(name, nick, email, password)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 로그인

const login = (req, res, next) => {
    const { email, password } = req.body;

    const secret = req.app.get('jwt-secret');
    const refresh = req.app.get('refresh-secret');

    const check = (user) => {
        if (!user) {
            throw new Error('Email is not exist');
        } else {
            if (user.verify(password)) {
                user.refresh = jwt.sign({
                    _id: user._id,
                    email: user.email,
                }, refresh,
                {
                    expiresIn: '12h',
                });
                user.save();
                const p = new Promise((resolve, reject) => {
                    jwt.sign({
                        _id: user._id,
                        name: user.name,
                        nick: user.nick,
                        email: user.email,
                    }, secret,
                    {
                        expiresIn: '5m',
                    }, (err, token) => {
                        if (err) reject(err);
                        resolve({
                            access_token: token,
                            refresh_token: user.refresh,
                        });
                    });
                    
                });
                return p;
            } else {
                throw new Error('incorrect password');
            }
        }    
    }


    const respond = (token) => {
        res.status(200).json(token);
    }

    const onError = (err) => {
        console.log(email, password);
        res.status(403).json(err.message);
    }

    User.findOneByEmail(email)
    .then(check)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 엑세스토큰 재발급

const refreshAccess = (req, res, next) => {
    const email = req.decoded.email;
    const secret = req.app.get('jwt-secret');

    const checkRefresh = (user) => {
        if (req.headers['x-refresh-token'] === user.refresh) {
            const p = new Promise((resolve, reject) => {
                jwt.sign({
                    _id: user._id,
                    name: user.name,
                    nick: user.nick,
                    email: user.email,
                }, secret,
                {
                    expiresIn: '5m'
                }, (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                });
            });
            return p;
        } else {
            throw new Error('Invalid refresh token');
        }
    }

    const respond = (token) => {
        res.status(200).json({ access: token });
    }

    const onError = (err) => {
        res.status(403).json({ message: err.message });
    }

    User.findOneByEmail(email)
    .then(checkRefresh)
    .then(respond)
    .catch(onError)
}

module.exports = {
    existEmail,
    existNick,
    register,
    emailSend,
    emailAuth,
    login,
    refreshAccess
}