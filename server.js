const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./db.js')

const app = require('./app.js')
//UNCAUGHTEXCEPTION
process.on('uncaughtException', err => {
    console.log('ERROR:', err.msg)
    console.log("SHUTTING SERVER")
    process.exit(1)
})
port = process.env.PORT || 3000


const server = app.listen(port, () => {
    console.log(`server is working at port: ${port}`)
})

connectDB()

//unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log('Error:', err.message, err.name);
    console.log('SHUTTING SERVER')
    server.close(() => {
        process.exit(1)
    })
})