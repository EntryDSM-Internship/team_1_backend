const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

const config = require('./config');

const swaggerDoc = YAML.load('./apidocs/swagger.yaml');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
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