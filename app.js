const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const presentersRouter = require('./routes/presenters');
const achievementsRouter = require('./routes/achievements');
const organizationsRouter = require('./routes/organizations');
const applicantsRouter = require('./routes/applicants');
const schoolsRouter = require('./routes/schools');
const profilesRouter = require('./routes/profiles');
const useruploadRouter = require('./routes/userupload');

/* Integration SIAKAD TASIK */
const siakadApplicants = require('./routes/integrations/SIAKAD-TASIK/siakad-applicants');

const app = express();

const allowedOrigins = ['http://localhost:5173'];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/achievements', achievementsRouter);
app.use('/organizations', organizationsRouter);
app.use('/presenters', presentersRouter);
app.use('/applicants', applicantsRouter);
app.use('/schools', schoolsRouter);
app.use('/profiles', profilesRouter);
app.use('/userupload', useruploadRouter);

/* Integration SIAKAD TASIK */
app.use('/integrations/siakadtasik/applicants', siakadApplicants);

module.exports = app;
