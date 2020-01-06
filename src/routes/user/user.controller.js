const User = require('../../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const smtpTransport = require('nodemailer-smtp-transport');
const handlebars = require('handlebars');

const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) console.log(err.message);
        else callback(null, html);
    })
} 

const transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
        user: 'seungbin031206@gmail.com',
        pass: 'ysb031206'
    }
}));

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

    emailCode = new Array();

    for (let i = 0; i < 6; i++) {
        emailCode.push(Math.floor(Math.random() * 10));
    }
      

    readHTMLFile(__dirname + '../../../Email.html', (err, html) => {
        const template = handlebars.compile(html);

        const replacements = {
            emailCode: emailCode.join(''),
        };

        const htmlSend = template(replacements);
        const mailOption = {
            from: 'seungbin031206@gmail.com',
            to: email,
            subject: 'mailAuth',
            html: htmlSend,
        }
        transport.sendMail(mailOption, (err, info) => {
            if (err) {
                res.json(err.message);
            } else {
                res.json(info.response);
            }
        })
    });
}

//-------------------------------------------------------
// 인증코드 확인

const emailAuth = (req, res, next) => {
    const authNum = req.body.auth;
    if (authNum === emailCode.join('')) {
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
// 프로필 사진 설정

const profile = (req, res, next) => {
    const nick = req.params.nick;
    
    const save = (user) => {
        if (req.file !== undefined) {
            user.img = 'profile/' + req.file.filename;
        }
        user.save();
        res.status(200).json({
            message: 'success',
            profile: user.img
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByNick(nick)
    .then(save)
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
                        img: user.img
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
                    img: user.img
                }, secret,
                {
                    expiresIn: '30m'
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
        res.status(200).json({ access_token: token });
    }

    const onError = (err) => {
        res.status(403).json({ message: err.message });
    }

    User.findOneByEmail(email)
    .then(checkRefresh)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 유저 검색

const search = (req, res, next) => {
    let isFollowed;

    const isFollow = (user) => {
        if (user.following.indexOf(req.params.nick) === -1) isFollowed = false
        else isFollowed = true

        return User.findOneByNick(req.params.nick);
    }

    const respond = (user) => {
        res.status(200).json({
            message: "success",
            profile: user.img,
            nick: user.nick,
            isFollowed: isFollowed
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.findOneByNick(req.decoded.nick)
    .then(isFollow)
    .then(respond)
    .catch(onError)
}

//-------------------------------------------------------
// 비밀번호 변경

const changePassword = (req, res, next) => {
    const { email, password } = req.body;

    const change = (user) => {
        user.password = password;
        user.save();
        res.status(200).json({
            message: "success",
            user
        });
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message,
        });
    }

    User.findOneByEmail(email)
    .then(change)
    .catch(onError)
}

module.exports = {
    existEmail,
    existNick,
    register,
    emailSend,
    emailAuth,
    profile,
    login,
    refreshAccess,
    search,
    changePassword
}