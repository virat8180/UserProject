const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) // data ka filename kaise rkhna h
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

//exports.module = storage
const upload = multer({ storage: storage })