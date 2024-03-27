const mongoose = require('mongoose')
const dotenv = require('dotenv')
const DB = 'mongodb+srv://virat:JvtdTwXXPMcebL26@atlascluster.ls6vsjh.mongodb.net/E-commerce'

const connectDB = async (res, err) => {
    //try {
    await mongoose.connect(DB)
    console.log('DB CONNECTED')
    // } catch (err) {
    //console.log("DB error", err)
    //  }
}

module.exports = connectDB
