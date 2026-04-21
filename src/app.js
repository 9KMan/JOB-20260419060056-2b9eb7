const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const config = require('./config');
const healthRoutes = require('./routes/health');
const callRoutes = require('./routes/calls');
const voicemailRoutes = require('./routes/voicemails');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(healthRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/voicemails', voicemailRoutes);

app.use(errorHandler);

module.exports = app;