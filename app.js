const express = require('express')
const errormw = require('./middleware/errormw.js')
const cookieparser = require('cookie-parser')
const dotenv = require('dotenv').config()
const passport = require('passport')
const session = require('express-session')
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const cors = require('cors');
const AppError = require('./errorhandler/errorclass.js')

const app = express()

app.use(express.json())
app.use(cookieparser())
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(cors())
app.use(helmet());




const userroute = require('./router/userroutes.js')



app.use('/api/v1/user', userroute)

app.use(errormw)
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app