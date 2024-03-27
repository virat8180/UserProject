exports.sendtoken = async (user, statuscode, res) => {
    const token = await user.getJWTToken()
    console.log('reached here')
    //cookie options
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true

    }
    user.password = undefined
    res.status(statuscode).cookie('token', token, options).json({
        success: true,
        user,
        token
    })

}