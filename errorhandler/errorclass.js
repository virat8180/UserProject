class ApiError extends Error {
    constructor(statuscode, message) {
        super(message)
        this.statsucode = statuscode
        this.message = message

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ApiError