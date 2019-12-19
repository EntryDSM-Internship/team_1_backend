// const jwt = require('jsonwebtoken');

// const refreshMiddleware = (req, res, next) => {
//     const refresh = req.headers['x-refresh-token'];
//     const email = req.decoded.email;
//     const secret = req.app.get('jwt-secret');

//     if (!refresh) {
//         res.status(403).json({ message: '로그인 되어있지 않음' });
//     }
    
//     const checkRefresh = (user) => {
//         if (refresh === user.refresh) {
//             const p = new Promise((resolve, reject) => {
//                 jwt.sign({
//                     _id: user._id,
//                     name: user.name,
//                     nick: user.nick,
//                     email: user.email,
//                 }, secret,
//                 {
//                     expiresIn: '5m'
//                 }, (err, token) => {
//                     if (err) reject(err)
//                     resolve(token)
//                 });
//             });
//             return p;
//         } else {
//             throw new Error('Invalid refresh token');
//         }
//     }

//     const respond = (token) => {
//         res.status(200).json({ access: token });
//     }

//     const onError = (err) => {
//         res.status(403).json({ message: err.message });
//     }

//     User.findOneByEmail(email)
//     .then(checkRefresh)
//     .then(respond)
//     .catch(onError)
// }

// module.exports = refreshMiddleware

const jwt = require('jsonwebtoken');

const refreshMiddleware = (req, res, next) => {
    const refresh = req.headers['x-refresh-token'] || req.query.token;

    if (!refresh) {
        res.status(403).json({ message: '로그인 되어있지 않음' });
    }

    const p = new Promise((resolve, reject) => {
        jwt.verify(refresh, req.app.get('refresh-secret'), (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });

    const onError = (err) => {
        res.status(403).json(err);
    }

    p.then((decoded) => {
        req.decoded = decoded;
        next();
    })
    .catch(onError)
}

module.exports = refreshMiddleware;