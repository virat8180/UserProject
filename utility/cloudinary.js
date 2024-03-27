const cloudinary = require('cloudinary').v2
const fs = require('fs')



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});

exports.uploadoncloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null

        const response = await cloudinary.uploader.upload(localfilepath)
        console.log(response.url)


        fs.unlinkSync(localfilepath)


        return response.url



    } catch (error) {
        fs.unlinkSync(localfilepath) // remove locally saved temp file
        return null
    }
}


