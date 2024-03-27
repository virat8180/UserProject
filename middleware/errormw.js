
const ApiError = require('../errorhandler/errorclass')

module.exports = async (err, req, res, next) => {
    err.statuscode = err.statuscode || 500
    err.message = err.message || 'Internal servor error'

    //mongoose error

    if (err.name === "CastError") {
        const message = ` Resource not Found Invalid: ${err.path}`
        return res.json(new ApiError(400, message))
    }
    //duplicate key error
    if (err.code === 11000) {
        const message = ` Duplicate ${Object.keys(err.keyValue)}`
        return res.json(new ApiError(400, message))
    }
    if (err.name === "jsonwebtoken") {
        const message = ` JSONWEBTOKEN Invalid`
        return res.json(new ApiError(400, message))
    }
    if (err.name === "TokenExpiredError") {
        const message = ` JSONWEBTOKEN Expired`
        return res.json(new ApiError(400, message))
    }


    res.status(err.statuscode).json({
        success: false,
        message: err.message
    })

}
