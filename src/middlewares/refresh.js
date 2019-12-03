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

module.exports = refreshMiddleware