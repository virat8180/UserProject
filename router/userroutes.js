const express = require('express')
const router = express.Router()
const usercontroller = require('../controller/User.js')
const isauth = require("../middleware/authmw.js")

//test route
router.route('/test').get(usercontroller.test)

router.route('/register').post(usercontroller.registeruser)
router.route('/login').post(usercontroller.loginuser)
router.route('/logout').get(usercontroller.logout)
router.route('/auth/google').get(usercontroller.oauth)

//protected routes


router.route('/me').get(isauth.isauthuser, usercontroller.getuserdetail)
router.route('/password/update').put(isauth.isauthuser, usercontroller.updatepassword)
router.route('/update/me').put(isauth.isauthuser, usercontroller.updateprofile)
router.route('/admin/users').get(isauth.isauthuser, isauth.authroles('admin'), usercontroller.admintogetallusers)
router.route('/normaluser/user').get(isauth.isauthuser, usercontroller.normaltogetallusers)
router.route('/changeprofiletype').post(isauth.isauthuser, usercontroller.changeprofiletype)






module.exports = router