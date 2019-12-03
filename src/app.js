const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');

const app = express();

const config = require('./config');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));

app.get('/', (req, res, next) => {
    res.send('Hello');
});

app.use('/api', require('./routes'));

app.set('jwt-secret', config.secretKey);
app.set('refresh-secret', config.refreshKey);

app.use((err, req, res, next) => {
    res.status(404).json(err);
});

app.listen(3000, () => {
    console.log('server on');
});

mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('DB connected');
});