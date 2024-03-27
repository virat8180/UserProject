const usermodel = require('../model/modeluser.js')
//const bcrypt = require(bcrypt)
const ApiError = require('../errorhandler/errorclass.js')
const Apiresponse = require('../utility/Apiresponse.js')
const mongoose = require('mongoose')
const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth2')



const uploadcloudinary = require('../utility/cloudinary.js')
const { sendtoken } = require('../utility/jwtoken.js')

const catchasync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

//test
exports.test = catchasync(async (req, res) => {
    res.send("hey its working")
})
//Registration
exports.registeruser = catchasync(async (req, res, next) => {
    const { name, email, password, passwordconfirm } = req.body
    console.log(name, email)
    if (!(email || password || passwordconfirm)) {
        return next(new ApiError(404, "please enter data"))
    }
    //const avatarlocalpath = req.files?.avatar[0]?.path
    //if (!avatarlocalpath) return new Apierror(400, "image is required")


    //upload in cloudinary,multer check + cloudinary check
    //const avatar = await uploadcloudinary(avatarlocalpath)
    //if (!avatar) return new Apierror(400, "image is required")

    const user = await usermodel.create({
        name,
        email,
        password,
        passwordconfirm,
        avatar: {
            publicid: 'link', url: "temp"

        }
    })



    sendtoken(user, 200, res)
})
//LOGIN 
exports.loginuser = catchasync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ApiError(404, "please give the data"))
    }



    const user = await usermodel.findOne({ email }).select('+password')
    if (!user) {
        next(new ApiError(401, "user doest not exist"))
    }
    const passwordmatch = await user.comparepassword(password)
    if (!passwordmatch) {
        next(new ApiError(401, "user doest not exist with this email or password"))
    }

    sendtoken(user, 201, res)



})
//LOGOUT
exports.logout = catchasync(async (req, res, next) => {
    // console.log('reached here')
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.json(new Apiresponse(200, 'loggedout successfully'))
})
//login or register in via google 





passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/secrets",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                //console.log(profile);
                const result = await usermodel.findOne({ email })

                if (!result) {
                    const newUser = await usermodel.create({

                        email,
                        password: "google",
                        passwordconfirm: "google",
                        avatar: profile.photos[0]


                    }
                    )

                    return cb(null, newUser);
                } else {
                    return cb(null);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});
//register via google
exports.oauth = catchasync(async (req, res) => {

    passport.authenticate('google', { scope: ['profile', 'email'] })
})


//Profile Details
exports.getuserdetail = catchasync(async (req, res, next) => {
    const user = await usermodel.findById(req.user.id) //ye auth route h to req.user mein user ka sab h
    res.json(new Apiresponse(200, "success", user))

})


//Update profile
exports.updateprofile = catchasync(async (req, res, next) => {
    const newdata = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        bio: req.body.bio
    }

    //avatar

    const user = await usermodel.findByIdAndUpdate(req.user.id, newdata, {
        new: true,
        runvalidator: true,
        useFindAndModify: true
    })

    res.json(new Apiresponse(200, user, "succesfully updated"))
})
//Update password

exports.updatepassword = catchasync(async (req, res, next) => {
    const user = await usermodel.findById(req.user.id).select('+password')
    const passwordmatch = await user.comparepassword(req.body.oldpassword)
    if (!passwordmatch) {
        next(new ApiError(401, "old password is incorrect password"))
    }

    //  if (req.body.oldpassword !== req.body.newpassword) {
    //    next(new ApiError(401, "both password incorrect password"))

    // }
    user.password = req.body.newpassword
    await user.save()

    res.json(new Apiresponse(200, "success", user))

})
//Changing profile type
exports.changeprofiletype = catchasync(async (req, res, next) => {
    const profiletype = { type: req.body.view }
    const user = await usermodel.findByIdAndUpdate(req.user.id, profiletype, {
        new: true,
        runvalidator: true,
        useFindAndModify: true
    })

    res.json(new Apiresponse(200, "Success", user))

})

//For Admin to get list of users
exports.admintogetallusers = catchasync(async (req, res, next) => {
    const users = await usermodel.find()
    res.json(new Apiresponse(200, users, "list of all users"))
})

//For Normal to get list of users
exports.normaltogetallusers = catchasync(async (req, res, next) => {
    const users = await usermodel.find({ type: "public" })
    res.json(new Apiresponse(200, users, "list of public users"))
})

//update photo
exports.updateavatar = catchasync(async (req, res) => {
    const avatarlocalpath = req.file?.path
    if (!avatarlocalpath) {
        return new apierror(404, 'path not available')
    }
    const avatar = await uploadcloudinary(avatarlocalpath)

    if (!avatar.url) {
        return new apierror(404, 'path could not be uploaded')
    }

    await usermodel.findbyIdandUpdate(req.user.id, {
        $set: {
            avatar: avatar.url
        }
    }).select("-password")

    return res.status(200).json(new Apiresponse(200, usermodel, 'image updated'))
})


