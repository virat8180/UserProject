//const catchasync = require('./catchasync.js')
const ApiError = require('../errorhandler/errorclass.js')
const jwt = require('jsonwebtoken')

const usermodel = require('../model/modeluser.js')

const catchasync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.isauthuser = catchasync(async (req, res, next) => {
    const { token } = req.cookies
    console.log(token)
    if (!token) {
        return next(new ApiError(404, "please login to access this"))
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRETKEY)
    req.user = await usermodel.findById(decoded.id)
    next()


})

exports.authroles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(401, `ROLE:${req.user.role} cannot access this route`))
        }
    }
    next()
}